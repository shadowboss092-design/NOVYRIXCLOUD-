/* NOVYRIXCLOUD CONFIG — editable catalogue values. Prices are draft PKR/month estimates, not confirmed live offers. */
window.NOVYRIX_CONFIG = {
  brand: "NOVYRIXCLOUD",
  logo: "https://i.postimg.cc/wTdcCwpc/NC.png",
  discord: "https://discord.gg/2nTjSWJXaQ",
  supportEmail: "support@example.com",
  currency: "PKR",
  plans: [
    {name:"Stone", type:"Minecraft", category:"Minecraft", price:250, unit:"/month", ram:"2 GB", cpu:"Shared CPU", storage:"10 GB NVMe*", features:["Minecraft Java server","Paper / Purpur support*","Backups available*","Discord community support"], badge:"STARTER"},
    {name:"Gold", type:"Minecraft", category:"Minecraft", price:500, unit:"/month", ram:"4 GB", cpu:"Shared CPU", storage:"20 GB NVMe*", features:["For small SMPs","Plugin support*","Easy upgrades*","Discord community support"], badge:"POPULAR"},
    {name:"Diamond", type:"Minecraft", category:"Minecraft", price:750, unit:"/month", ram:"6 GB", cpu:"Shared CPU", storage:"30 GB NVMe*", features:["For growing communities","Mod/plugin-ready*","Backup options*","Priority support*"], badge:""},
    {name:"Netherite", type:"Minecraft", category:"Minecraft", price:1000, unit:"/month", ram:"8 GB", cpu:"Shared CPU", storage:"40 GB NVMe*", features:["For larger servers","More plugin headroom","Easy upgrade path*","Priority support*"], badge:"MAX POWER"},
    {name:"VPS Start", type:"VPS", category:"VPS", price:700, unit:"/month", ram:"2 GB", cpu:"2 vCPU*", storage:"30 GB NVMe*", features:["Linux VPS*","Root access if KVM plan*","Public IPv4 availability*","Community support"], badge:"STARTER"},
    {name:"VPS Boost", type:"VPS", category:"VPS", price:1300, unit:"/month", ram:"4 GB", cpu:"2 vCPU*", storage:"50 GB NVMe*", features:["For websites and bots","Linux OS options*","Firewall setup guidance","Easy upgrade path*"], badge:"POPULAR"},
    {name:"VPS Ultra", type:"VPS", category:"VPS", price:1900, unit:"/month", ram:"6 GB", cpu:"4 vCPU*", storage:"70 GB NVMe*", features:["For multiple services","More memory headroom","Linux OS options*","Priority support*"], badge:""},
    {name:"VPS Titan", type:"VPS", category:"VPS", price:2500, unit:"/month", ram:"8 GB", cpu:"4 vCPU*", storage:"100 GB NVMe*", features:["For heavier workloads","More storage capacity","Upgrade path*","Priority support*"], badge:"MAX POWER"},
    {name:"Bot Mini", type:"Bot Hosting", category:"Bot Hosting", price:150, unit:"/month", ram:"512 MB", cpu:"Shared CPU", storage:"2 GB SSD*", features:["Discord bot hosting*","Persistent files*","Community support"], badge:""},
    {name:"Bot Plus", type:"Bot Hosting", category:"Bot Hosting", price:300, unit:"/month", ram:"1 GB", cpu:"Shared CPU", storage:"5 GB SSD*", features:["For larger bots","Persistent files*","Restart controls*"], badge:"POPULAR"},
    {name:"Bot Pro", type:"Bot Hosting", category:"Bot Hosting", price:500, unit:"/month", ram:"2 GB", cpu:"Shared CPU", storage:"10 GB SSD*", features:["For multiple bots","More memory headroom","Priority support*"], badge:""}
  ]
};
