const { keith } = require("../keizzah/keith");
const eco = require('discord-mongoose-economy');
const ty = eco.connect(mongodb);

// Keith command: economy
keith({
    nomCom: "economy",
    reaction: "🕯️",
    categorie: "economy",
});

// Keith command: daily
keith({
    nomCom: "daily",
    categorie: "economy",
    filename: __filename,
    reaction: "💷"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, nomAuteurMessage, verifGroupe, arg } = commandeOptions;
    
    let zerogroup = await zk.findOne({ id: dest }) || await new zk({ id: dest }).save();
    let mongoschemas = zerogroup.economy || "false";
    if (mongoschemas == "false") return repondre("*🚦Economy* is not active in current group.");
    
    if (!verifGroupe) return repondre("This command is only for groups.");
    
    const alpha = "alpha";
    const daily = await eco.daily(dest, alpha, 2000); // Give 2000 for daily, can be changed

    if (daily.cd) {
        return await repondre(`🧧 You already claimed daily for today, come back in ${daily.cdL}🫡`);
    } else {
        return repondre(`You claimed daily ${daily.amount} 🪙 for today🎉.`);
    }
});

// Keith command: reset wallet
keith({
    nomCom: "resetwallet",
    categorie: "economy",
    filename: __filename,
    reaction: "💷"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser, nomAuteurMessage, verifGroupe, arg } = commandeOptions;
    
    let zerogroup = await zk.findOne({ id: dest }) || await new zk({ id: dest }).save();
    let mongoschemas = zerogroup.economy || "false";
    if (mongoschemas == "false") return repondre("*🚦Economy* is not active in current group.");
    
    if (!superUser) return repondre("You need my owner privileges.");
    
    let users = mentionedJid ? mentionedJid[0] : msg.contextInfo.participant || false;
    if (!users) return repondre("Please give me a user.");

    const balance = await eco.balance(users, "alpha");
    await eco.deduct(users, "alpha", balance.wallet);
    
    return await repondre(`⛩️ User: @${users.split('@')[0]} \n*🧧 @${users.split('@')[0]} lost all 🪙 in wallet.*\n_Now live with that poverty.🫡_`, { mentions: [users] });
});

// Keith command: capacity
keith({
    nomCom: "capacity",
    categorie: "economy",
    filename: __filename,
    reaction: "💷"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser, nomAuteurMessage, verifGroupe, arg } = commandeOptions;
    const text = arg.join(" ");
    let zerogroup = await zk.findOne({ id: dest }) || await new zk({ id: dest }).save();
    let mongoschemas = zerogroup.economy || "false";
    if (mongoschemas == "false") return repondre("*🚦Economy* is not active in current group.");
    
    if (!verifGroupe) return repondre("Only used in group.");
    
    if (!text) return repondre(`💴 *Bank-capacity* 💳\n\n1 | *1000 sp* = 🪙100\n\n2 | *100000 sp* = 🪙1000\n\n3 | *10000000 sp* = 🪙10000000\n\nExample: ${prefix}capacity 1 OR ${prefix}bankupgrade 1000`);

    let user = mentionedJid ? mentionedJid[0] : msg.contextInfo.participant || false;
    const alpha = "alpha";
    let value = text.trim();
    let k = parseInt(value);
    
    const balance = await eco.balance(user, alpha);
    
    switch (value) {
        case '1000':
        case '1':
            if (k > balance.wallet) return repondre(`*You need to pay 🪙100 to increase bank capacity ~ 1000 sp.*`);
            await eco.deduct(user, alpha, 100);
            await eco.giveCapacity(user, alpha, 1000);
            return await repondre(`*1000 🪙 diamond storage has been added to ${nomAuteurMessage}'s bank.*`);
        
        case '100000':
        case '2':
            if (k < balance.wallet) return repondre(`*You need to pay 🪙1000 to increase bank capacity ~ 100000 sp.*`);
            await eco.deduct(user, alpha, 1000);
            await eco.giveCapacity(user, alpha, 100000);
            return await repondre(`*100000 🪙 diamond storage has been added to ${nomAuteurMessage}'s bank.*`);
        
        case '10000000':
        case '3':
            if (k < balance.wallet) return repondre(`*You need to pay 🪙10000 to increase bank capacity ~ 10000000 sp.*`);
            await eco.deduct(user, alpha, 10000);
            await eco.giveCapacity(user, alpha, 10000000);
            return await repondre(`*10000000 🪙 diamond storage has been added to ${nomAuteurMessage}'s bank.*`);
        
        default:
            return await repondre('*What are you trying to do📉?*');
    }
});
