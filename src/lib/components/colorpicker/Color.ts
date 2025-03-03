export class Color {
	h = 0;
	s = 0;
	l = 0;

	constructor(args: { h: number; s: number; l: number }) {
		this.h = args.h;
		this.s = args.s;
		this.l = args.l;
	}

	getHslCode() {
		return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
	}

	setH(h: number) {
		this.h = h;
	}

	setS(s: number) {
		this.s = s;
	}

	setL(l: number) {
		this.l = l;
	}

	getNewWithH(h: number) {
		return new Color({
			h: h,
			s: this.s,
			l: this.l
		});
	}

	getClosestFullColor() {
		return new Color({
			h: this.h,
			s: 100,
			l: 50
		});
	}
}
