module("selector");

/*test("child and adjacent", function() {
	expect(1);
	t( "Nth-child", "#form select:first option:nth-child(-n+3)", ["option1a", "option1b", "option1c"] );
	
});*/

test("broken", function() {
	expect(6);
	
	function broken(name, selector) {
		try {
			jCSS(selector);
		} catch(e){
			ok(  typeof e === "string" && e.indexOf("Syntax error") >= 0,
				name + ": " + selector );
		}
	}
	
	broken( "Broken Selector", "[", [] );
	broken( "Broken Selector", "(", [] );
	broken( "Broken Selector", "<", [] );
	broken( "Broken Selector", "()", [] );
	broken( "Broken Selector", "<>", [] );
	broken( "Broken Selector", "{}", [] );
	
});

test("element", function() {
	expect(18);
	reset();

	ok( jCSS("*").length >= 30, "Select all" );
	var all = jCSS("*"), good = true;
	for ( var i = 0; i < all.length; i++ )
		if ( all[i].nodeType == 8 )
			good = false;
	ok( good, "Select all elements, no comment nodes" );
	t( "Element Selector", "p", ["firstp","ap","sndp","en","sap","first"] );
	t( "Element Selector", "body", ["body"] );
	t( "Element Selector", "html", ["html"] );
	t( "Parent Element", "div p", ["firstp","ap","sndp","en","sap","first"] );
	equals( jCSS("param", "#object1").length, 2, "Object/param as context" );

	isSet( jCSS("p", document.getElementsByTagName("div")), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
	isSet( jCSS("p", "div"), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
	isSet( jCSS("p", jCSS("div")), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
	isSet( jCSS("div p"), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context." );
	
	ok( jCSS("#length").length, '&lt;input name="length"&gt; cannot be found under IE, see #945' );
	ok( jCSS("#lengthtest input").length, '&lt;input name="length"&gt; cannot be found under IE, see #945' );

	// Check for unique-ness and sort order
	isSet( jCSS("*"), jCSS("*, *"), "Check for duplicates: *, *" );
	isSet( jCSS("p"), jCSS("p, div p"), "Check for duplicates: p, div p" );

	t( "Checking sort order", "h2, h1", ["header", "banner", "userAgent"] );
	t( "Checking sort order", "h2:first, h1:first", ["header", "banner"] );
	t( "Checking sort order", "p, p a", ["firstp", "simon1", "ap", "google", "groups", "anchor1", "mark", "sndp", "en", "yahoo", "sap", "anchor2", "simon", "first"] );
});

test("id", function() {
	expect(23);
	t( "ID Selector", "#body", ["body"] );
	t( "ID Selector w/ Element", "body#body", ["body"] );
	t( "ID Selector w/ Element", "ul#first", [] );
	t( "ID selector with existing ID descendant", "#firstp #simon1", ["simon1"] );
	t( "ID selector with non-existant descendant", "#firstp #foobar", [] );
	//t( "ID selector using UTF8", "#å°åŒ—TaÌibeÌŒi", ["å°åŒ—TaÌibeÌŒi"] );
	//t( "Multiple ID selectors using UTF8", "#å°åŒ—TaÌibeÌŒi, #å°åŒ—", ["å°åŒ—TaÌibeÌŒi","å°åŒ—"] );
	//t( "Descendant ID selector using UTF8", "div #å°åŒ—", ["å°åŒ—"] );
	//t( "Child ID selector using UTF8", "form > #å°åŒ—", ["å°åŒ—"] );
	
	t( "Escaped ID", "#foo\\:bar", ["foo:bar"] );
	t( "Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant escaped ID", "div #foo\\:bar", ["foo:bar"] );
	t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped ID", "form > #foo\\:bar", ["foo:bar"] );
	t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	
	t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] ); // bug #267
	t( "ID Selector, not an ancestor ID", "#form #first", [] );
	t( "ID Selector, not a child ID", "#form > #option1a", [] );
	
	t( "All Children of ID", "#foo > *", ["sndp", "en", "sap"] );
	t( "All Children of ID with no children", "#firstUL > *", [] );
	
	jQuery('<a name="tName1">tName1 A</a><a name="tName2">tName2 A</a><div id="tName1">tName1 Div</div>').appendTo('#main');
	equals( jCSS("#tName1")[0].id, 'tName1', "ID selector with same value for a name attribute" );
	equals( jCSS("#tName2").length, 0, "ID selector non-existing but name attribute on an A tag" );
	t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", ["lengthtest"] );
	
	t( "ID selector with non-existant ancestor", "#asdfasdf #foobar", [] ); // bug #986

	isSet( jCSS("body div#form"), [], "ID selector within the context of another element" );

	t( "Underscore ID", "#types_all", ["types_all"] );
	t( "Dash ID", "#fx-queue", ["fx-queue"] );

	//t( "ID with weird characters in it", "#name\\+value", ["name+value"] );
});

test("class", function() {
	expect(17);
	
	t( "Class Selector", ".blog", ["mark","simon"] );
	t( "Class Selector", ".GROUPS", ["groups"] );
	t( "Class Selector", ".blog.link", ["simon"] );
	t( "Class Selector w/ Element", "a.blog", ["mark","simon"] );
	t( "Parent Class Selector", "p .blog", ["mark","simon"] );

	isSet( jCSS(".blog", document.getElementsByTagName("p")), q("mark", "simon"), "Finding elements with a context." );
	isSet( jCSS(".blog", "p"), q("mark", "simon"), "Finding elements with a context." );
	isSet( jCSS(".blog", jCSS("p")), q("mark", "simon"), "Finding elements with a context." );
	isSet( jQuery("p .blog"), q("mark", "simon"), "Finding elements with a context." );
	
	//t( "Class selector using UTF8", ".å°åŒ—TaÌibeÌŒi", ["utf8class1"] );
	//t( "Class selector using UTF8", ".å°åŒ—", ["utf8class1","utf8class2"] );
	//t( "Class selector using UTF8", ".å°åŒ—TaÌibeÌŒi.å°åŒ—", ["utf8class1"] );
	//t( "Class selector using UTF8", ".å°åŒ—TaÌibeÌŒi, .å°åŒ—", ["utf8class1","utf8class2"] );
	//t( "Descendant class selector using UTF8", "div .å°åŒ—TaÌibeÌŒi", ["utf8class1"] );
	//t( "Child class selector using UTF8", "form > .å°åŒ—TaÌibeÌŒi", ["utf8class1"] );

	t( "Escaped Class", ".foo\\:bar", ["foo:bar"] );
	t( "Escaped Class", ".test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant scaped Class", "div .foo\\:bar", ["foo:bar"] );
	t( "Descendant scaped Class", "div .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped Class", "form > .foo\\:bar", ["foo:bar"] );
	t( "Child escaped Class", "form > .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

	var div = document.createElement("div");
  	div.innerHTML = "<div class='test e'></div><div class='test'></div>";
	isSet( jCSS(".e", div), [ div.firstChild ], "Finding a second class." );

	div.lastChild.className = "e";

	isSet( jCSS(".e", div), [ div.firstChild, div.lastChild ], "Finding a modified class." );
});

test("name", function() {
	expect(11);

	t( "Name selector", "input[name=action]", ["text1"] );
	t( "Name selector with single quotes", "input[name='action']", ["text1"] );
	t( "Name selector with double quotes", 'input[name="action"]', ["text1"] );

	t( "Name selector non-input", "[name=test]", ["length", "fx-queue"] );
	t( "Name selector non-input", "[name=div]", ["fadein"] );
	t( "Name selector non-input", "*[name=iframe]", ["iframe"] );

	t( "Name selector for grouped input", "input[name='types[]']", ["types_all", "types_anime", "types_movie"] )

	isSet( jCSS("#form input[name=action]"), q("text1"), "Name selector within the context of another element" );
	isSet( jCSS("#form input[name='foo[bar]']"), q("hidden2"), "Name selector for grouped form element within the context of another element" );

	var a = jQuery('<a id="tName1ID" name="tName1">tName1 A</a><a id="tName2ID" name="tName2">tName2 A</a><div id="tName1">tName1 Div</div>').appendTo('#main');

	t( "Find elements that have similar IDs", "[name=tName1]", ["tName1ID"] );
	t( "Find elements that have similar IDs", "[name=tName2]", ["tName2ID"] );

	a.remove();
});


test("multiple", function() {
	expect(4);
	
	t( "Comma Support", "h2, p", ["banner","userAgent","firstp","ap","sndp","en","sap","first"]);
	t( "Comma Support", "h2 , p", ["banner","userAgent","firstp","ap","sndp","en","sap","first"]);
	t( "Comma Support", "h2 , p", ["banner","userAgent","firstp","ap","sndp","en","sap","first"]);
	t( "Comma Support", "h2,p", ["banner","userAgent","firstp","ap","sndp","en","sap","first"]);
});

test("child and adjacent", function() {
	expect(47);
	t( "Child", "p > a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p> a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p >a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p>a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child w/ Class", "p > a.blog", ["mark","simon"] );
	t( "All Children", "code > *", ["anchor1","anchor2"] );
	t( "All Grandchildren", "p > * > *", ["anchor1","anchor2"] );
	t( "Adjacent", "a + a", ["groups"] );
	t( "Adjacent", "a +a", ["groups"] );
	t( "Adjacent", "a+ a", ["groups"] );
	t( "Adjacent", "a+a", ["groups"] );
	t( "Adjacent", "p + p", ["ap","en","sap"] );
	t( "Adjacent", "p#firstp + p", ["ap"] );
	t( "Adjacent", "p[lang=en] + p", ["sap"] );
	t( "Adjacent", "a.GROUPS + code + a", ["mark"] );
	t( "Comma, Child, and Adjacent", "a + a, code > a", ["groups","anchor1","anchor2"] );

	t( "Verify deep class selector", "div.blah > p > a", [] );

	t( "No element deep selector", "div.foo > span > a", [] );
	t( "No element not selector", ".container div:not(.excluded) div", [] );

	isSet( jCSS("> :first", document.getElementById("nothiddendiv")), q("nothiddendivchild"), "Verify child context positional selctor" );
	isSet( jCSS("> :eq(0)", document.getElementById("nothiddendiv")), q("nothiddendivchild"), "Verify child context positional selctor" );
	isSet( jCSS("> *:first", document.getElementById("nothiddendiv")), q("nothiddendivchild"), "Verify child context positional selctor" );

	t( "Non-existant ancestors", ".fototab > .thumbnails > a", [] );
	
	t( "First Child", "p:first-child", ["firstp","sndp"] );
	t( "Nth Child", "p:nth-child(1)", ["firstp","sndp"] );

	//Verify that the child position isn't being cached improperly
	jQuery("p:first-child").after("<div></div>");
	jQuery("p:first-child").before("<div></div>").next().remove();

	t( "First Child", "p:first-child", [] );

	reset();
	
	t( "Last Child", "p:last-child", ["sap"] );
	t( "Last Child", "a:last-child", ["simon1","anchor1","mark","yahoo","anchor2","simon","liveLink1","liveLink2"] );
	
	t( "Nth-child", "#main form#form > *:nth-child(2)", ["text1"] );
	t( "Nth-child", "#main form#form > :nth-child(2)", ["text1"] );

	t( "Nth-child", "#form select:first option:nth-child(3)", ["option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(0n+3)", ["option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(1n)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(n)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(even)", ["option1b", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(odd)", ["option1a", "option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(2n)", ["option1b", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(2n+1)", ["option1a", "option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(3n)", ["option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(3n+1)", ["option1a", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(3n+2)", ["option1b"] );
	t( "Nth-child", "#form select:first option:nth-child(3n+3)", ["option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(3n-1)", ["option1b"] );
	t( "Nth-child", "#form select:first option:nth-child(3n-2)", ["option1a", "option1d"] );
	t( "Nth-child", "#form select:first option:nth-child(3n-3)", ["option1c"] );
	t( "Nth-child", "#form select:first option:nth-child(3n+0)", ["option1c"] );
	//t( "Nth-child", "#form select:first option:nth-child(-n+3)", ["option1a", "option1b", "option1c"] );
});

test("attributes", function() {
	expect(36);
	t( "Attribute Exists", "a[title]", ["google"] );
	t( "Attribute Exists", "*[title]", ["google"] );
	t( "Attribute Exists", "[title]", ["google"] );
	t( "Attribute Exists", "a[ title ]", ["google"] );
	
	t( "Attribute Equals", "a[rel='bookmark']", ["simon1"] );
	t( "Attribute Equals", 'a[rel="bookmark"]', ["simon1"] );
	t( "Attribute Equals", "a[rel=bookmark]", ["simon1"] );
	t( "Attribute Equals", "a[href='http://www.google.com/']", ["google"] );
	t( "Attribute Equals", "a[ rel = 'bookmark' ]", ["simon1"] );

	document.getElementById("anchor2").href = "#2";
	t( "href Attribute", "p a[href^=#]", ["anchor2"] );
	t( "href Attribute", "p a[href*=#]", ["simon1", "anchor2"] );

	t( "for Attribute", "form label[for]", ["label-for"] );
	t( "for Attribute in form", "#form [for=action]", ["label-for"] );
	
	jCSS("form input")[0].test = 0;
	jCSS("form input")[1].test = 1;

  // Disabled tests - expandos don't work in all browsers
	//t( "Expando attribute", "form input[test]", ["text1", "text2"] );
	//t( "Expando attribute value", "form input[test=0]", ["text1"] );
	//t( "Expando attribute value", "form input[test=1]", ["text2"] );
	
	t( "Attribute containing []", "input[name^='foo[']", ["hidden2"] );
	t( "Attribute containing []", "input[name^='foo[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name*='[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name$='bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name$='[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name$='foo[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name*='foo[bar]']", ["hidden2"] );
	
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type='hidden']", ["radio1", "radio2", "hidden1"] );
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=\"hidden\"]", ["radio1", "radio2", "hidden1"] );
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=hidden]", ["radio1", "radio2", "hidden1"] );
	
	//t( "Attribute selector using UTF8", "span[lang=ä¸­æ–‡]", ["å°åŒ—"] );
	
	t( "Attribute Begins With", "a[href ^= 'http://www']", ["google","yahoo"] );
	t( "Attribute Ends With", "a[href $= 'org/']", ["mark"] );
	t( "Attribute Contains", "a[href *= 'google']", ["google","groups"] );
	t( "Attribute Is Not Equal", "#ap a[hreflang!='en']", ["google","groups","anchor1"] );

	t("Empty values", "#select1 option[value='']", ["option1a"]);
	t("Empty values", "#select1 option[value!='']", ["option1b","option1c","option1d"]);
	
	t("Select options via :selected", "#select1 option:selected", ["option1a"] );
	t("Select options via :selected", "#select2 option:selected", ["option2d"] );
	t("Select options via :selected", "#select3 option:selected", ["option3b", "option3c"] );
	
	t( "Grouped Form Elements", "input[name='foo[bar]']", ["hidden2"] );
	
	t( ":not() Existing attribute", "#form select:not([multiple])", ["select1", "select2"]);
	t( ":not() Equals attribute", "#form select:not([name=select1])", ["select2", "select3"]);
	t( ":not() Equals quoted attribute", "#form select:not([name='select1'])", ["select2", "select3"]);
});

test("pseudo (:) selectors", function() {
	expect(70);
	
	t( "First Child", "p:first-child", ["firstp","sndp"] );
	t( "Last Child", "p:last-child", ["sap"] );
	t( "Only Child", "a:only-child", ["simon1","anchor1","yahoo","anchor2","liveLink1","liveLink2"] );
	t( "Empty", "ul:empty", ["firstUL"] );
	t( "Enabled UI Element", "#form input:not([type=hidden]):enabled", ["text1","radio1","radio2","check1","check2","hidden2","name"] );
	t( "Disabled UI Element", "#form input:disabled", ["text2"] );
	t( "Checked UI Element", "#form input:checked", ["radio2","check1"] );
	t( "Selected Option Element", "#form option:selected", ["option1a","option2d","option3b","option3c"] );
	t( "Text Contains", "a:contains('Google')", ["google","groups"] );
	t( "Text Contains", "a:contains('Google Groups')", ["groups"] );

	t( "Text Contains", "a:contains('Google Groups (Link)')", ["groups"] );
	t( "Text Contains", "a:contains('(Link)')", ["groups"] );

	t( "Element Preceded By", "p ~ div", ["foo","fx-queue","fx-tests", "moretests","tabindex-tests", "liveHandlerOrder"] );
	t( "Not", "a.blog:not(.link)", ["mark"] );
	t( "Not - multiple", "#form option:not(:contains('Nothing'),#option1b,:selected)", ["option1c", "option1d", "option2b", "option2c", "option3d", "option3e"] );
	//t( "Not - complex", "#form option:not([id^='opt']:nth-child(-n+3))", [ "option1a", "option1d", "option2d", "option3d", "option3e"] );
	t( "Not - recursive", "#form option:not(:not(:selected))[id^='option3']", [ "option3b", "option3c"] );

	t( ":not() failing interior", "p:not(.foo)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "p:not(div.foo)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "p:not(p.foo)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "p:not(#blargh)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "p:not(div#blargh)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "p:not(p#blargh)", ["firstp","ap","sndp","en","sap","first"] );

	t( ":not Multiple", "p:not(a)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "p:not(a, b)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "p:not(a, b, div)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "p:not(p)", [] );
	t( ":not Multiple", "p:not(a,p)", [] );
	t( ":not Multiple", "p:not(p,a)", [] );
	t( ":not Multiple", "p:not(a,p,b)", [] );
	t( ":not Multiple", ":input:not(:image,:input,:submit)", [] );
	
	t( "nth Element", "p:nth(1)", ["ap"] );
	t( "First Element", "p:first", ["firstp"] );
	t( "Last Element", "p:last", ["first"] );
	t( "Even Elements", "p:even", ["firstp","sndp","sap"] );
	t( "Odd Elements", "p:odd", ["ap","en","first"] );
	t( "Position Equals", "p:eq(1)", ["ap"] );
	t( "Position Greater Than", "p:gt(0)", ["ap","sndp","en","sap","first"] );
	t( "Position Less Than", "p:lt(3)", ["firstp","ap","sndp"] );
	t( "Is A Parent", "p:parent", ["firstp","ap","sndp","en","sap","first"] );
	t( "Is Visible", "#form input:visible", [] );
	t( "Is Visible", "div:visible:not(.testrunner-toolbar)", ["nothiddendiv", "nothiddendivchild"] );
	t( "Is Hidden", "#form input:hidden", ["text1","text2","radio1","radio2","check1","check2","hidden1","hidden2","name"] );
	t( "Is Hidden", "#main:hidden", ["main"] );
	t( "Is Hidden", "#dl:hidden", ["dl"] );

	t( "Check position filtering", "div#nothiddendiv:eq(0)", ["nothiddendiv"] );
	t( "Check position filtering", "div#nothiddendiv:last", ["nothiddendiv"] );
	t( "Check position filtering", "div#nothiddendiv:not(:gt(0))", ["nothiddendiv"] );
	t( "Check position filtering", "#foo > :not(:first)", ["en", "sap"] );
	t( "Check position filtering", "select > :not(:gt(2))", ["option1a", "option1b", "option1c"] );
	t( "Check position filtering", "select:lt(2) :not(:first)", ["option1b", "option1c", "option1d", "option2a", "option2b", "option2c", "option2d"] );
	t( "Check position filtering", "div.nothiddendiv:eq(0)", ["nothiddendiv"] );
	t( "Check position filtering", "div.nothiddendiv:last", ["nothiddendiv"] );
	t( "Check position filtering", "div.nothiddendiv:not(:lt(0))", ["nothiddendiv"] );

	t( "Check element position", "div div:eq(0)", ["nothiddendivchild"] );
	t( "Check element position", "div div:eq(5)", ["fadeout"] );
	t( "Check element position", "div div:eq(27)", ["t2037"] );
	t( "Check element position", "div div:first", ["nothiddendivchild"] );
	t( "Check element position", "div > div:first", ["nothiddendivchild"] );
	t( "Check element position", "#dl div:first div:first", ["foo"] );
	t( "Check element position", "#dl div:first > div:first", ["foo"] );
	t( "Check element position", "div#nothiddendiv:first > div:first", ["nothiddendivchild"] );
	
	t( "Form element :input", "#form :input", ["text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "button", "area1", "select1", "select2", "select3"] );
	t( "Form element :radio", "#form :radio", ["radio1", "radio2"] );
	t( "Form element :checkbox", "#form :checkbox", ["check1", "check2"] );
	t( "Form element :text", "#form :text", ["text1", "text2", "hidden2", "name"] );
	t( "Form element :radio:checked", "#form :radio:checked", ["radio2"] );
	t( "Form element :checkbox:checked", "#form :checkbox:checked", ["check1"] );
	t( "Form element :radio:checked, :checkbox:checked", "#form :radio:checked, #form :checkbox:checked", ["radio2", "check1"] );

	t( "Headers", ":header", ["header", "banner", "userAgent"] );
	t( "Has Children - :has()", "p:has(a)", ["firstp","ap","en","sap"] );
});