import mongoose, { Document, Schema } from 'mongoose';

export interface IGames extends Document {
	_id: string;
	amountbet: number;
	choice: 'heads' | 'tails' | 'edge';
	result: 'heads' | 'tails' | 'edge';
	win: 'win' | 'lose';
	name: string;
	play_at: Date;
}

const gamesSchema = new Schema({
	amountbet: { type: Number, require: true },
	choice: { type: String, enum: ['heads', 'tails', 'edge'], require: true },
	result: { type: String, enum: ['heads', 'tails', 'edge'], require: true },
	win: { type: String, enum: ['win', 'lose'], require: true },
	name: { type: String },
	play_at: { type: Date, default: Date.now },
});

const Games = mongoose.model<IGames>('Games', gamesSchema);

export default Games;
