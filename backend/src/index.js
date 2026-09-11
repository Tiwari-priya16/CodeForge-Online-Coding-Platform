const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const { redisClient } = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);

const InitalizeConnection = async () => {
    try {
        await main();

        // Non-blocking background Redis connect
        redisClient.connect().then(() => {
            console.log("Redis Connected Successfully");
        }).catch((err) => {
            console.log("Redis background connection note:", err.message);
        });
        
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log("Server listening at port number: " + port);
        });
    } catch (err) {
        console.error("Initialization Error:", err.message);
    }
};

InitalizeConnection();
