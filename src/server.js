/* IMPORTS */
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import mongoose from "mongoose";
import { json } from "body-parser";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import session from 'express-session';
import fileUpload from "express-fileupload";
const MongoStore = require('connect-mongo')(session);
import cookieParser from "cookie-parser";
import AWS from "aws-sdk";

/* CONFIG */
dotenv.config();
const { PORT, NODE_ENV, MONGO_URI, JWT_SECRET, VISIKOM_API_KEY } = process.env;
const dev = NODE_ENV === 'development';


/*  DIGITAL OCEAN SPACES INIT */
const spacesEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
});

/* MONGO DB CONNECTION */
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  console.log("MongoDB connected!");
	});  


/* WEB SERVER START AND CONFIG */
const sessionHandler = session({
	name: 'Auth',
	secret: JWT_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
	  maxAge: 3 * 60 * 60 * 1000,
	  secure: false
	},
	store: new MongoStore({ mongooseConnection: db })
  });
polka()
	.use(cookieParser(JWT_SECRET))
	// Session middleware will be used only for following url or for any if there is a valid signed cookie named Auth
	.use((req, res, next) => {
		if (req.url.includes("/adminka")||req.url.includes("/logadmin")||req.url.includes("/auth")||(req.signedCookies&&req.signedCookies.Auth)) {
			return sessionHandler(req, res, next);
		} else {
			next();
		}
	})
	.use('/estates/create', auth)
	.use('/estates/manage', auth)
	.use('/estates/update', auth)
	.use(
		compression({ threshold: 0 }),
		json(),
		fileUpload(),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => {
			res.setHeader('cache-control', 'no-cache, no-store')
			  return (req.session&&req.session.token?{
				token: req.session && req.session.token,
				agentIdentifier: req.session && req.session.agentIdentifier,
				visikom: req.session && req.session.token && VISIKOM_API_KEY
			  }:{})}
			})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
	
 /* middleware */
 function auth(req, res, next) {
	const { token } = req.session;
	if(!req.session||!token){
		res
		.writeHead(401, {
			'Content-Type': 'application/json'
		})
		.end(JSON.stringify({
			error: "Access denied!"
		}));
		return;
	}
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		req.s3 = s3;
		next();
	} catch (error) {
		res
		.writeHead(400, {
			'Content-Type': 'application/json'
		})
		.end(JSON.stringify(error));
		return;
	}
}
