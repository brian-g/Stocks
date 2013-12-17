<a href="#details?stock=${Symbol}" class="stock" data-id=${Symbol}>
	<header>
		<div>
			<h1 class="stock-Heading" data-bind="text: Symbol"></h1>
			<h2 class="stock-Description" data-bind="text: Name"></h2>
		</div>
		<div>
			<div class="stock-Bid" data-bind="text: Bid"></div>
			<div class="stock-Change" data-bind="css: { down: Change < 0, up: Change > 0 }">
				<span class="stock-ChangeIndicator"></span>
				<span class="stock-ChangePercent" data-bind="text: PercentChange"></span>
				<span class="stock-ChangeValue" data-bind="text: Change"></span>
			</div>
		</div>
	</header>

	<section class="stock-Details">
		<div id="container" class="stock-ChartContainer"></div>
		<div class="stock-InfoContainer">
			<table>
				<tr>
					<td class="label">Market cap</td>
					<td class="value" data-bind="text: MarketCapitalization"></td>
				</tr>
				<tr>
					<td class="label">Days low</td>
					<td class="value" data-bind="text: DaysLow"></td>
				</tr>
				<tr>
					<td class="label">Days high</td>
					<td class="value" data-bind="text: DaysHigh"></td>
				</tr>
				<tr>
					<td class="label">Year high</td>
					<td class="value" data-bind="text: YearsHigh"></td>
				</tr>
				<tr>
					<td class="label">Years low</td>
					<td class="value" data-bind="text: YearsLow"></td>
				</tr>
			</table>			
		</div>
	</section>
</a>
