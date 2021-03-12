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

/* CONFIG */
dotenv.config();
const { PORT, NODE_ENV, MONGO_URI, JWT_SECRET } = process.env;
const dev = NODE_ENV === 'development';

/* MONGO DB CONNECTION */
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  console.log("MongoDB connected!");
	});  


/* WEB SERVER START AND CONFIG */
polka()
	.use('/estates/create', auth)
	.use(
		compression({ threshold: 0 }),
		json(),
		fileUpload({
			
		}),
		session({
			name: 'Auth',
			secret: JWT_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
			  maxAge: 3 * 60 * 60 * 1000,
			  secure: false
			},
			store: new MongoStore({ mongooseConnection: db, ttl: 3 * 60 * 60 * 1000 })
		  }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => {
			res.setHeader('cache-control', 'no-cache, no-store')
			  return ({
				token: req.session && req.session.token,
				agentIdentifier: req.session && req.session.agentIdentifier
			  })}
			})
		
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
	
 /* middleware */
 function auth(req, res, next) {
	const token = req.headers.authorization;

	if(!token || token == 'undefined'){
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
		const ver = jwt.verify(token.replace('Bearer ',''), process.env.JWT_SECRET);
		req.user = ver;
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