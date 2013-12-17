// "use strict";

var error_str = "Error retrieving stock information";

var magicEnv = 'store://datatables.org/alltableswithkeys';
var magicStatement = 'select Symbol, Name, Bid, LastTradePriceOnly, PreviousClose, Change, PercentChange from yahoo.finance.quotes where symbol in ';
var validateStatement = 'select symbol from yahoo.finance.stocks where symbol=';
var marketUtcOpen = 13;
var marketUtcClose = 21;

var delay = 100;

var stocks = ['YHOO', 'AAPL', 'GOOG', 'MSFT', 'NOK', 'DIS', 'DJIA', 'HP', 'F', 'BP', 'BBY'];

var intervalID;



function error(m) {
	var e = $('#error').text(m);
	e.slideDown(0.75 * 1000, function() {
		setTimeout(function() { e.slideUp('fast'); }, 5 * 1000);
	});
}

function construct_statement() {
	
	var s = '(';
	jQuery.each(stocks, function(i, el) {
		s += '"' + el + '"' + (  (i < stocks.length - 1) ? ',' : '' );
	});
	return (s += ')');
	
}

function update_stocks() {
	var statement = magicStatement + construct_statement();
	var d = new Date();
	
	if (d.getUTCHours() < marketUtcOpen || d.getUTCHours() > marketUtcClose || d.getDay() === 0 || d.getDay() === 6)
	{
		return;
	}
	$.queryYQL(statement, magicEnv, function(data) {
		if (data.error)
		{
			console.log("YQL Error:" + data.error.description);
			error(error_str);
		}
		else if (data.query.count > 0)
		{
			var time = new Date();
			
			jQuery.each(data.query.results.quote, function(i, v) {
				var e = $('.stock[data-id=' + v.Symbol + ']');
				var c;
				var n;
				
				e.find('.stock-Bid').text(v.LastTradePriceOnly);
				e.find('.stock-Change').attr('data-change-indicator', v.Change < 0 ? 'down' : 'up');
				e.find('.stock-ChangePercent').text(v.PercentChange);
				e.find('.stock-ChangeValue').text(v.Change);
				
				c = e.find('.stock-ChartContainer');
				n = $('<div class="stock-ChartContainer" style="opacity:0;background-image:url(http://chart.finance.yahoo.com/z?s=' + v.Symbol + '&t=1d&z=s&' + (new Date()).getTime() + ')"></div>');
				c.parent().append(n);

				setTimeout(function() { n.css('opacity','1'); c.remove();}, 1000);
			});
			
			$('#status').text('Last updated: ' + time.toLocaleTimeString());
		}
		else {
			error(error_str);
			console.log('YQL Error: whoops. that strange place');
		}
	});
}


function showStocks()
{
	$('.stock').css('opacity', '1');
	$('#activity').css('opacity','0');
}

function fill_stocks() {

	var t = $('#stock-list').empty();
	
	var statement = magicStatement + construct_statement();
		
	$.queryYQL(statement, magicEnv, function(data) {

		if (data.error)
		{
			error(error_str);
			console.log(data.error.description);
			showStocks();
		}
		else if (data.query.count > 0)
		{
			var time = new Date();
			$('#stock-template').tmpl(data.query.results.quote).appendTo(t);
		
			t.append('<a href="#" data-action="add" class="stock"><div class="stock-add"><input autocapitalize="off" autocorrect="off" style="display:none" placeholder="(e.g. AAPL)" type="text" maxlength="10"><span class="icon-plus">Add stock</span></div></a>');
			$('[data-action="add"]').on('click', function(e) {
				e.preventDefault();
				show_stock_add($(this));
			});

			var d = 0;
			$('.stock').each(function() {
				$(this).css('transition-delay', d + 'ms');
				d += delay;
			});
			setTimeout(showStocks, 400);
			$('#status').text('Last updated: ' + time.toLocaleTimeString());
		}
		else {
			var p;
			error(error_str);
			console.log('YQL Error: something happened. not sure what');
			for (p in data.query)
			{
				console.log(p + "=" + data[p]);
			}
			showStocks();
		}
	});
}

function validate_stock(s) {
	alert(s);
}

function show_stock_add(el) {
	
	var i = el.find('input').fadeIn();
	el.find('.icon-plus').fadeOut();
	i.focus();
	
}

function revert_stock_add(el) {
	el.find('input').fadeOut();
	el.find('.icon-plus').fadeIn();
}

function remove_stock() {

}

function reorder_stock() {

}


function init_storage() {
	if(typeof(Storage)!=="undefined") {
	
		if (localStorage.stocks !== undefined)
		{
			stocks = JSON.parse(localStorage.stocks);
		}
		else
		{
			localStorage.stocks = JSON.stringify(stocks);
		}
	}
	else
	{
		console.log("HTML Error: no local storage");
	}
}

$(document).ready(function() {

	// iOS doesn't like CSS using calc()
	$('#activity').css('top', $(window).height() / 2 - 16);
	$('#activity').css('left', $(window).width() / 2 - 16);
	$('#activity').css('opacity', '1.0');
	
	init_storage();
	fill_stocks();

	intervalID = setInterval(update_stocks, 60000 * 5);
	
	$('body').on('change', 'input', function() {
		revert_stock_add($(this).parent());
		validate_stock($(this).val());
	});
});