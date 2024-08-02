/* eslint-disable no-console  -- console*/
import app from './app';

const normalizePort = (val: string): number | string | false => {
	const port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

const port = normalizePort(process.env.PORT || '3002');
app.set('port', port);

const errorHandler = (error: {
	(arg0: string): void,
	(arg0: string): void,
	syscall: any,
	code: any,
}) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
	switch (error.code) {
		case 'EACCES':
			error(`${bind} requires elevated privileges.`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			error(`${bind} is already in use.`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

server.on('error', errorHandler);
