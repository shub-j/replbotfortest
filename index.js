const { Client, MessageEmbed }  = require("discord.js");
const { config } = require("dotenv");

const client = new Client({
    disableEveryone: true
});


config({

    path: __dirname + "/.env"

})

const firebaseConfig = {
    
apiKey: "AIzaSyC5Q90kZ4XSvKhp2NSoi38ISLVgICBNBu0",
    authDomain: "the-rush-93924.firebaseapp.com",
    databaseURL: "https://the-rush-93924.firebaseio.com",
    projectId: "the-rush-93924",
    storageBucket: "the-rush-93924.appspot.com",
    messagingSenderId: "942981978063",
    appId: "1:942981978063:web:3474d2f0d2f8f5126ae4ba",
    measurementId: "G-CD1811DFMC"
  };

  const firebase = require("firebase")
  const admin = require("firebase-admin")

  firebase.initializeApp(firebaseConfig)
  

client.on("ready", () => {

    console.log("Bot Online.")
    client.user.setStatus("Moderating")
    client.user.setActivity("BETA Training Outpost",   {
        type: "STREAMING",
        url: "https://www.roblox.com/games/5779559273/BETA-Training-Outpost"
    })
})


client.on("message", async message => {
    const prefix = ";";

    if(message.author .bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    const args =   message.content.slice(prefix.length).trim().split(/ + /g);
    const cmd = args.shift().toLowerCase();

    if(cmd === "id") {
        const msg = await message.channel.send(`${message.member.id}`);
    }

    if(cmd === "ping") {
        const embed =  new MessageEmbed()
        .setAuthor(message.member.user.tag, message.author.displayAvatarURL())
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL)
        .setFooter(client.user.username)
        .setTimestamp()
        .setTitle("Ping")
        .setDescription("Pinging bot...")
        const msg = await message.channel.send(embed)
        let ping = embed.createdAt - embed.createdAt
        var apiLat = Math.round(client.ws.ping)
        embed.setDescription(`Bot Latency is ${ping}ms. API Latency is ${apiLat}ms.`)
        msg.edit(embed)
    }

    if(cmd === "status") {
        const embed =  new MessageEmbed()
        .setAuthor(message.member.user.tag, message.author.displayAvatarURL())
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL)
        .setFooter(client.user.username)
        .setTimestamp()
        .setTitle("Bot Status:")
        .setDescription("Bot is online.")

        const msg = await message.channel.send(embed)
    }

    if(cmd === "help") {
        const embed =  new MessageEmbed()
        .setAuthor(message.member.user.tag, message.author.displayAvatarURL())
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL)
        .setFooter(client.user.username)
        .setTimestamp()
        .setTitle("Commands")
        .setDescription(";PING: Checks the bot's ping.\n;HELP: Displays all available commands.\n ;STATUS: Show bot's status.\n ;SERVERINFO: Shows information about the server.\n ;VALOR: Checks player's valor.\n ;SETVALOR: Sets player's valor.");

        const msg = await message.channel.send(embed);
    }

    if(cmd === "serverinfo") {
        const embed = new MessageEmbed()
        embed.setDescription("Server Info")
        embed.addField('Name', `${message.guild.name}`, (`${message.guild.nameAcronym, true}`))
        embed.addField('Server Owner', message.guild.owner.user.tag, true)
        embed.addField("Server Create Date", message.guild.createdAt, true)
        embed.addField("Member Count", message.guild.memberCount, true)
        embed.setColor("BLUE")
 
 
            message.channel.send(embed);
    }

    if(message.content.startsWith(';valor')){

        const powerembed = new MessageEmbed()
        
        .setTitle("Incorrect Format")
        .setFooter("Format: ;valors <User>", message.author.avatarURL())
        .setDescription("Format: ;valors <User>")
        .setColor("BLUE")
        .setTimestamp()
    
    
        var user1 = message.content.split(' ').slice(1).join(' ');
        if (!user1) return message.channel.send(powerembed);
                
        //basic read data
        readName(user1)
        function readName(id){
        var path = '/Saves/';
        path += id; 
    
            //once for trigger only once
            firebase.database().ref(path).once('value', snapshot =>{
                if(snapshot.exists()) {
                    snapshot.forEach((child) => {
                        let key = child.key;
                        let value = child.val();
                        
                                    const databasevalue = new MessageEmbed()
                                    
                                    .setTitle('User found: ' + user1)
                                    .setColor("BLUE")
                                    .setTimestamp()
                                    .setThumbnail("http://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&Format=Png&username="+user1)
                                    .addFields(
                                        { name: `Success!`, value: `${user1} / Power`},
                                        { name: `${user1}`, value: `Power: ${require('util').inspect(value)}`}
        
                                    )
            
                                    message.channel.send(databasevalue)
                                    console.log(value);
                                
                                
                        });
                } else {
                    const databasevalue = new MessageEmbed()
                                    
                                    .setTitle('User not found.')
                                    .setColor("BLUE")
                                    .setTimestamp()
                                    .addFields(
                                        { name: `Failed.`, value: `No user exists in the database.`}
                                    )
            
                                    message.channel.send(databasevalue)
                }   
            });
        }
    
    }

    if(message.content.startsWith(';setvalor')){

        if(!message.member.roles.cache.some(r => r.name === "Valor")) return


        var user1 = message.content.slice(prefix.length).split(' ');
        console.log(user1[1]);
        console.log(user1[2]);

        const setDatabasePower = new MessageEmbed()
        .setTitle('User found: ' + user1[1])
        .setColor("BLUE")
        .setTimestamp()
        .setThumbnail("http://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&Format=Png&username="+user1[1])
        .addFields(

            { name: `Success!`, value: `${user1[1]} / Valor set to ${user1[2]}`}

        )

        message.channel.send(setDatabasePower)

        firebase.database().ref(`/Saves/${user1[1]}`).set({
            Power: parseInt(user1[2])
        })
    }

})

client.login(process.env.TOKEN);
