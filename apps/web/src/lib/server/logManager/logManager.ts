import { DISCORD_WEBHOOK_URL } from '$env/static/private';

const colors = {
	error: 16711680,
	info: 247548,
	warn: 16241455
};

export const logManager = {
	log: async (args: { type: 'error' | 'info' | 'warn'; message: string; alert: boolean }) => {
		try {
			await fetch(DISCORD_WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: `New Log ${args.alert ? '@everyone' : '(silent)'}`,
					embeds: [
						{
							title: args.type,
							description: args.message,
							color: colors[args.type].toString()
						}
					]
				})
			});

			return;
		} catch (e) {
			console.warn(e);
			return;
		}
	}
};
