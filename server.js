const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public");
const DATA_FILE = path.join(__dirname, "data", "plans.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");
const TICKETS_FILE = path.join(__dirname, "data", "tickets.json");
// Read the same initial catalogue as the browser config, without executing it.
const DEFAULT_PLANS = [
 {name:"Stone",type:"Minecraft",category:"Minecraft",price:250,unit:"/month",ram:"2 GB",cpu:"Shared CPU",storage:"10 GB NVMe*",features:["Minecraft Java server","Paper / Purpur support*","Backups available*","Discord community support"],badge:"STARTER"},
 {name:"Gold",type:"Minecraft",category:"Minecraft",price:500,unit:"/month",ram:"4 GB",cpu:"Shared CPU",storage:"20 GB NVMe*",features:["For small SMPs","Plugin support*","Easy upgrades*","Discord community support"],badge:"POPULAR"},
 {name:"Diamond",type:"Minecraft",category:"Minecraft",price:750,unit:"/month",ram:"6 GB",cpu:"Shared CPU",storage:"30 GB NVMe*",features:["For growing communities","Mod/plugin-ready*","Backup options*","Priority support*"],badge:""},
 {name:"Netherite",type:"Minecraft",category:"Minecraft",price:1000,unit:"/month",ram:"8 GB",cpu:"Shared CPU",storage:"40 GB NVMe*",features:["For larger servers","More plugin headroom","Easy upgrade path*","Priority support*"],badge:"MAX POWER"},
 {name:"VPS Start",type:"VPS",category:"VPS",price:700,unit:"/month",ram:"2 GB",cpu:"2 vCPU*",storage:"30 GB NVMe*",features:["Linux VPS*","Root access if KVM plan*","Public IPv4 availability*","Community support"],badge:"STARTER"},
 {name:"VPS Boost",type:"VPS",category:"VPS",price:1300,unit:"/month",ram:"4 GB",cpu:"2 vCPU*",storage:"50 GB NVMe*",features:["For websites and bots","Linux OS options*","Firewall setup guidance","Easy upgrade path*"],badge:"POPULAR"},
 {name:"VPS Ultra",type:"VPS",category:"VPS",price:1900,unit:"/month",ram:"6 GB",cpu:"4 vCPU*",storage:"70 GB NVMe*",features:["For multiple services","More memory headroom","Linux OS options*","Priority support*"],badge:""},
 {name:"VPS Titan",type:"VPS",category:"VPS",price:2500,unit:"/month",ram:"8 GB",cpu:"4 vCPU*",storage:"100 GB NVMe*",features:["For heavier workloads","More storage capacity","Upgrade path*","Priority support*"],badge:"MAX POWER"},
 {name:"Bot Mini",type:"Bot Hosting",category:"Bot Hosting",price:150,unit:"/month",ram:"512 MB",cpu:"Shared CPU",storage:"2 GB SSD*",features:["Discord bot hosting*","Persistent files*","Community support"],badge:""},
 {name:"Bot Plus",type:"Bot Hosting",category:"Bot Hosting",price:300,unit:"/month",ram:"1 GB",cpu:"Shared CPU",storage:"5 GB SSD*",features:["For larger bots","Persistent files*","Restart controls*"],badge:"POPULAR"},
 {name:"Bot Pro",type:"Bot Hosting",category:"Bot Hosting",price:500,unit:"/month",ram:"2 GB",cpu:"Shared CPU",storage:"10 GB SSD*",features:["For multiple bots","More memory headroom","Priority support*"],badge:""}
];
app.disable("x-powered-by");
app.use(express.json({limit:"200kb"}));
app.use(session({secret:process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",maxAge:8*60*60*1000}}));
function getPlans(){try{return JSON.parse(fs.readFileSync(DATA_FILE,"utf8"));}catch{return DEFAULT_PLANS;}}
function savePlans(plans){fs.mkdirSync(path.dirname(DATA_FILE),{recursive:true});fs.writeFileSync(DATA_FILE,JSON.stringify(plans,null,2)+"\n","utf8");}
function readJson(file,fallback=[]){try{return JSON.parse(fs.readFileSync(file,"utf8"));}catch{return fallback;}}
function writeJson(file,data){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data,null,2)+"\n","utf8");}
function isUser(req,res,next){if(req.session && req.session.userId)return next();return res.status(401).json({error:"Please log in or register first."});}
function hashPassword(password,salt){return crypto.scryptSync(password,salt,64).toString("hex");}
function isAdmin(req,res,next){if(req.session && req.session.isAdmin)return next();return res.status(401).json({error:"Please log in again."});}
app.get("/api/plans",(_req,res)=>res.json({plans:getPlans()}));
app.get("/api/me",(req,res)=>res.json({user:req.session?.userId?{id:req.session.userId,email:req.session.userEmail}:null}));
app.post("/api/register",(req,res)=>{
 const email=typeof req.body.email==="string"?req.body.email.trim().toLowerCase():"";
 const password=typeof req.body.password==="string"?req.body.password:"";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>190)return res.status(400).json({error:"Enter a valid email address."});
 if(password.length<8||password.length>200)return res.status(400).json({error:"Password must be 8–200 characters."});
 const users=readJson(USERS_FILE,[]);if(users.some(u=>u.email===email))return res.status(409).json({error:"An account with this email already exists."});
 const id=crypto.randomUUID(),salt=crypto.randomBytes(16).toString("hex");users.push({id,email,salt,passwordHash:hashPassword(password,salt),createdAt:new Date().toISOString()});writeJson(USERS_FILE,users);
 req.session.regenerate(err=>{if(err)return res.status(500).json({error:"Could not start session."});req.session.userId=id;req.session.userEmail=email;res.json({ok:true,user:{id,email}});});
});
app.post("/api/login",(req,res)=>{
 const email=typeof req.body.email==="string"?req.body.email.trim().toLowerCase():"",password=typeof req.body.password==="string"?req.body.password:"";
 const users=readJson(USERS_FILE,[]),u=users.find(x=>x.email===email);
 const candidate=u?hashPassword(password,u.salt):hashPassword(password,"novyrix-dummy-salt");
 if(!u||!crypto.timingSafeEqual(Buffer.from(candidate),Buffer.from(u.passwordHash)))return res.status(401).json({error:"Invalid email or password."});
 req.session.regenerate(err=>{if(err)return res.status(500).json({error:"Could not start session."});req.session.userId=u.id;req.session.userEmail=u.email;res.json({ok:true,user:{id:u.id,email:u.email}});});
});
app.post("/api/logout",(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.get("/api/tickets",isUser,(req,res)=>res.json({tickets:readJson(TICKETS_FILE,[]).filter(t=>t.userId===req.session.userId)}));
app.post("/api/tickets",isUser,(req,res)=>{
 const subject=typeof req.body.subject==="string"?req.body.subject.trim():"",category=typeof req.body.category==="string"?req.body.category:"General",message=typeof req.body.message==="string"?req.body.message.trim():"";
 if(subject.length<4||subject.length>100||message.length<10||message.length>4000)return res.status(400).json({error:"Subject must be 4–100 characters and message 10–4000 characters."});
 if(!["General","Billing","Minecraft Hosting","VPS Hosting","Bot Hosting","Technical Issue"].includes(category))return res.status(400).json({error:"Choose a valid ticket category."});
 const tickets=readJson(TICKETS_FILE,[]),ticket={id:crypto.randomUUID(),userId:req.session.userId,email:req.session.userEmail,subject,category,message,status:"Open",createdAt:new Date().toISOString(),replies:[]};tickets.unshift(ticket);writeJson(TICKETS_FILE,tickets);res.status(201).json({ok:true,ticket});
});
app.get("/api/admin/tickets",isAdmin,(_req,res)=>res.json({tickets:readJson(TICKETS_FILE,[])}));
app.patch("/api/admin/tickets/:id",isAdmin,(req,res)=>{const tickets=readJson(TICKETS_FILE,[]),t=tickets.find(x=>x.id===req.params.id);if(!t)return res.status(404).json({error:"Ticket not found."});const status=req.body.status;if(!["Open","In Progress","Closed"].includes(status))return res.status(400).json({error:"Invalid ticket status."});t.status=status;writeJson(TICKETS_FILE,tickets);res.json({ok:true,ticket:t});});
app.post("/api/admin/login",(req,res)=>{
 const ip=req.ip; const now=Date.now(); const tries=loginTries.get(ip)||{count:0,until:0};
 if(tries.until>now)return res.status(429).json({error:"Too many login attempts. Try again in a few minutes."});
 const username=process.env.ADMIN_USERNAME || "admin";
 const password=process.env.ADMIN_PASSWORD || "admin"; // Change this before public deployment.
 const userOk=typeof req.body.username==="string" && crypto.timingSafeEqual(Buffer.from(req.body.username.padEnd(256).slice(0,256)),Buffer.from(username.padEnd(256).slice(0,256)));
 const pass=typeof req.body.password==="string"?req.body.password:"";
 const passOk=crypto.timingSafeEqual(crypto.createHash("sha256").update(pass).digest(),crypto.createHash("sha256").update(password).digest());
 if(!userOk||!passOk){tries.count++;if(tries.count>=6){tries.count=0;tries.until=now+5*60*1000;}loginTries.set(ip,tries);return res.status(401).json({error:"Invalid username or password."});}
 loginTries.delete(ip);req.session.regenerate(err=>{if(err)return res.status(500).json({error:"Could not start admin session."});req.session.isAdmin=true;res.json({ok:true});});
});
const loginTries=new Map();
app.post("/api/admin/logout",isAdmin,(req,res)=>req.session.destroy(()=>res.json({ok:true})));
app.put("/api/admin/plans",isAdmin,(req,res)=>{
 const plans=req.body && req.body.plans;
 if(!Array.isArray(plans)||plans.length>100)return res.status(400).json({error:"Plans must be a list of at most 100 entries."});
 for(const p of plans){
  if(!p||!['Minecraft','VPS','Bot Hosting'].includes(p.type)||typeof p.name!=="string"||!p.name.trim()||p.name.length>60||!Number.isFinite(Number(p.price))||Number(p.price)<0||Number(p.price)>100000000||!["ram","cpu","storage"].every(k=>typeof p[k]==="string"&&p[k].length<=80)||!Array.isArray(p.features)||p.features.length>12||p.features.some(f=>typeof f!=="string"||f.length>120))return res.status(400).json({error:"One or more plans have invalid fields. Check names, category, price, specs and features."});
  p.category=p.type;p.price=Number(p.price);p.name=p.name.trim();p.unit="/month";p.badge=typeof p.badge==="string"?p.badge.slice(0,30):"";
 }
 try{savePlans(plans);res.json({ok:true,message:"Plans saved successfully."});}catch(e){console.error(e);res.status(500).json({error:"Could not save plans. Check server folder write permissions."});}
});
app.use(express.static(PUBLIC));
app.get("/",(_req,res)=>res.sendFile(path.join(PUBLIC,"index.html")));
app.get("/plans",(_req,res)=>res.sendFile(path.join(PUBLIC,"plans.html")));
app.get("/previews",(_req,res)=>res.sendFile(path.join(PUBLIC,"previews.html")));
app.get("/support",(_req,res)=>res.sendFile(path.join(PUBLIC,"support.html")));
app.get("/status",(_req,res)=>res.sendFile(path.join(PUBLIC,"status.html")));
app.get("/admin",(_req,res)=>res.sendFile(path.join(PUBLIC,"admin.html")));
app.get("/auth",(_req,res)=>res.sendFile(path.join(PUBLIC,"auth.html")));
app.get("/tickets",(_req,res)=>res.sendFile(path.join(PUBLIC,"tickets.html")));
app.get("*",(_req,res)=>res.status(404).sendFile(path.join(PUBLIC,"404.html")));
app.listen(PORT,"0.0.0.0",()=>console.log(`NOVYRIXCLOUD is running on port ${PORT}`));
