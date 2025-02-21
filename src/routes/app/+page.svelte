<div class="wrap">
	<div class="header">
		<h2 class="greeting">Hello, John</h2>
		<h3>Class in 3 hours</h3>
	</div>

	<div class="twoPaneWrap">
		<div class="courses">
			<div class="courseRecap">
				<div class="chart">chart</div>
				<div class="text">
					<span>
						5 <span class="lightText">Assingments due today</span>
					</span>
					<span>
						7 <span class="lightText">Assingments due in the next 3 days</span>
					</span>
					<span>
						21 <span class="lightText">Assingments due in the next 7 days</span>
					</span>
				</div>
			</div>
		</div>
		<div class="right"></div>
	</div>
</div>

<style lang="scss">
	.twoPaneWrap {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		height: 100%;
		width: 100%;
	}

	.courses {
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.right {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		background: var(--secondary);
		height: 100%;
		border-radius: 1rem;
	}
	.greeting {
		font-weight: 400;
	}

	h3 {
		font-weight: 300;
		opacity: 0.8;
	}

	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
		height: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.courseRecap {
		border-radius: 0.5rem;
		background: transparent;
		position: relative;
		background: var(--secondary);
		padding: 0.5rem;

		&::before {
			content: '';
			display: inline-block;
			border-radius: inherit;
			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			width: calc(100% - 2px);
			height: calc(100% - 2px);
			inset: 0;
			padding: 1px;
			background: conic-gradient(from -100deg, transparent 0deg, white 20deg, transparent 200deg);
			-webkit-mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			mask:
				linear-gradient(#fff 0 0) content-box,
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			opacity: 0.2;
		}
	}

	.lightText {
		opacity: 0.7;
		font-weight: 300;
	}
</style>
