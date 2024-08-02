/* eslint-disable no-console -- console */
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User, { IUser } from './models/User';
import Games from './models/Games';

dotenv.config();

// Init app
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Déterminer les URLs client en fonction de l'environnement
const clientURL = process.env.CLIENT_URL as string;

// Configuration CORS
app.use(
	cors({
		origin: [clientURL],
		methods: ['POST', 'GET', 'DELETE', 'PUT'],
		credentials: true,
	})
);

const mongoDb = process.env.MONGODB_URI as string;
async function main() {
	console.log('Starting MongoDB connection...');
	mongoose.set('strictQuery', false);

	try {
		await mongoose.connect(mongoDb),
			{
				serverSelectionTimeoutMS: 5000, // Augmenter le temps de délai à 5000 ms (5 secondes)
			};
		console.log('MongoDB connection established.');
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
	}

	mongoose.connection.on('error', (err) => {
		console.error('MongoDB connection error:', err);
	});
}

main();

app.get('/api/balance/:name', async (req, res) => {
	const name = req.params.name;
	const user: IUser | null = await User.findOne({ name });

	if (!user) {
		return res.status(404).json({ error: 'User not found !' });
	}

	try {
		const balance = user.balance;

		console.log('balance:', balance);

		return res.status(200).json({ balance });
	} catch (error) {}
});

app.post('/api/playgame', async (req, res) => {
	const { bet, choice, result, messageType, name } = req.body;
	const user: IUser | null = await User.findOne({ name });

	if (!user) {
		return res.status(404).json({ error: 'User not found !' });
	}

	const balance = user.balance;

	if (bet > balance) {
		console.log('error', '2 balance');

		return res.status(400).json({ error: 'Insufficient balance for play' });
	}

	if (![10, 20, 50].includes(bet)) {
		console.log('error', '3 bet');

		return res.status(400).json({ error: 'Invalid bet amount' });
	}

	const win = messageType;
	try {
		const data = {
			amountbet: bet, // Assurez-vous que le nom du champ correspond à votre modèle
			choice,
			result,
			win,
			name,
		};

		await Games.create(data);

		let newBalance = balance - bet;

		if (messageType === 'win') {
			newBalance += bet * 2;
		}

		user.balance = newBalance;

		await user.save();

		return res.status(200).json({ mess: 'success' });
	} catch (error) {
		console.log('error', '4 catch');

		return res.status(500).json({ error: 'Error impossible to create headsortail' });
	}
});

export default app;
function logError(err: any) {
	throw new Error('Function not implemented.');
}
