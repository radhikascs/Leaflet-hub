function loadLayout() {
    /* For demo purposes */
    var demo = $("<div />").css({
        position: "fixed",
        top: "45px",
        right: "0",
        background: "rgba(0, 0, 0, 0.7)",
        "border-radius": "5px 0px 0px 5px",
        padding: "6px 15px",
        "font-size": "16px",
        "z-index": "999999",
        cursor: "pointer",
        color: "#ddd"
    }).html("<i class='fa fa-gear'></i>").addClass("no-print");

    var demo_settings = $("<div />").css({
        "padding": "10px",
        position: "fixed",
        top: "34px",
        right: "-200px",
        background: "#fff",
        border: "3px solid rgba(0, 0, 0, 0.7)",
        "width": "200px",
        "z-index": "999999"
    }).addClass("no-print");
    demo_settings.append(
        "<h4 style='margin: 0 0 5px 0; border-bottom: 1px dashed #ddd; padding-bottom: 3px;'>Layout Options</h4>" + "<div class='form-group no-margin'>" + "<div class='.checkbox'>" + "<label>" + "<input type='checkbox' name='fixlayoutBtn'/> " + "Fixed layout" + "</label>" + "</div>" + "</div>"
    );
    demo_settings.append(
        "<h4 style='margin: 0 0 5px 0; border-bottom: 1px dashed #ddd; padding-bottom: 3px;'>Skins</h4>" + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-black' onchange='change_skin(\"skin-black\")' /> " + "Black" + "</label>" + "</div>" + "</div>"

        + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-blue' onchange='change_skin(\"skin-blue\");' checked='checked'/> " + "Blue" + "</label>" + "</div>" + "</div>" 
		
		+ "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-green' onchange='change_skin(\"skin-green\");'/> " + "Green" + "</label>" + "</div>" + "</div>" 

        // + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-themeblue' onchange='change_skin(\"skin-blue\");' /> " + "Aqua blue" + "</label>" + "</div>" + "</div>"

        + "<div class='form-group no-margin'>" + "<div class='.radio'>" + "<label>" + "<input name='skins' type='radio' data-skin = 'skin-red'  /> " + "Red" + "</label>" + "</div>" + "</div>"
    );

    demo.click(function() {
        if (!$(this).hasClass("open")) {
            $(this).css("right", "200px");
            demo_settings.css("right", "0");
            $(this).addClass("open");
        } else {
            $(this).css("right", "0");
            demo_settings.css("right", "-200px");
            $(this).removeClass("open")
        }
    });

    $("body").append(demo);
    $("body").append(demo_settings);

}

// $(".

function change_layout() {
    $("body").toggleClass("fixed");
    fix_sidebar();
}

function change_skin(cls) {
	alert("skins")
    $("body").removeClass("skin-blue skin-black skin-themeblue skin-red skin-green");
    $("body").addClass(cls);
}




$(document).ready(function() {

    $('input[type="checkbox"][name="fixlayoutBtn"]').on('ifChanged', function(event) {
        //alert(0);
        $("body").toggleClass("fixed");
        fix_sidebar();

    });

    $('input[type="radio"][name="skins"]').on('ifChanged', function(event) {

    	$("body").removeClass("skin-blue skin-black skin-themeblue skin-red skin-green");

    	$("body").addClass($(this)[0].attributes[2].value);
      
    	//console.log($(this)[0].attributes[2].value);  

    });


})