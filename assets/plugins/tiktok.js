const { cmd, commands } = require('../command');

cmd({
    pattern: "tt",
    desc: "To download TikTok videos.",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0] || !isUrl(args[0])) {
            return reply('*Please provide a valid TikTok link.*');
        }

        await m.react('🕒');

        let res;
        try {
            res = await ttdl(args[0]); // Assure-toi que ttdl() est bien défini dans tes fonctions
        } catch (error) {
            console.error("Error fetching TikTok data:", error);
            return reply('*Error obtaining data.*');
        }

        if (!res || !res.data || res.data.length === 0) {
            return reply('*No result found.*');
        }

        let data = res.data.find(i => i.resolution === "720p (HD)") || res.data.find(i => i.resolution === "360p (SD)");

        if (!data || !data.url) {
            return reply('*No data found.*');
        }

        await m.react('✅');

        let video = data.url;
        let caption = '© 2024 KYOTAKA TikTok Downloader | Download with ease, cherish forever.';

        try {
            await conn.sendMessage(m.chat, { 
                video: { url: video }, 
                caption, 
                fileName: 'tt.mp4', 
                mimetype: 'video/mp4' 
            }, { quoted: m });
        } catch (error) {
            console.error("Error sending video:", error);
            return reply('*Error downloading video.*');
        }
    } catch (e) {
        console.error("Unexpected error in tt command:", e);
        reply(`*Error:* ${e.message}`);
    }
});
