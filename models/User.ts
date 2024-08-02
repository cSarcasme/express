import mongoose, { Document, Schema } from 'mongoose';

// Définir l'interface pour le document User
export interface IUser extends Document {
	_id: string;

	balance: number;
	name: string;

	lastUpdated: Date;
}

// Définir le schéma du modèle User
const userSchema = new Schema({
	balance: { type: Number, default: 0 },
	name: { type: String },
	lastUpdated: { type: Date, default: Date.now },
});

// Exporter le modèle User avec l'interface IUser
const User = mongoose.model<IUser>('User', userSchema);
export default User;
