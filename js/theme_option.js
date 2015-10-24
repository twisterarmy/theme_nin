$(window).resize(function()
{
    testRightSide();
    reAppendModules();
});

$(window).load(function()
{
    testRightSide();
});


$(document).ready(function()
{
    var windowHeight = $(window).height();
    
    testRightSide();
    reOrganizeTemplates();

    $.globalEval(postToElem.toString().replace(/postContext.append\(_templatePostRtBy/,
        'postContext.addClass(\'post-retransmited-by-container\').prependTo(postContext.parent()).append(_templatePostRtBy'));

    $( '.userMenu-home.current a' ).on( 'click', function() {
        $('html, body').animate({scrollTop:0},300);
        return false
    });

    // modify the way promoted posts are shown
    $( ".promoted-posts-only").click(function() {
        //active promoted posts tab
        $(this).children('.promoted-posts').addClass(promotedPostsOnly ? "active" : "disabled");
        $(this).children('.normal-posts').addClass(promotedPostsOnly ? "disabled" : "active");
        $('#postboard-top').removeClass(promotedPostsOnly ? "show" : "hide");
        //active normal posts
        $(this).children('.promoted-posts').removeClass(promotedPostsOnly ? "disabled" : "active");
        $(this).children('.normal-posts').removeClass(promotedPostsOnly ? "active" : "disabled");
        $('#postboard-top').addClass(promotedPostsOnly ? "hide" : "show");
    });

    if (/\/options.html$/i.test(document.location))
        $(document).ready(localizeLabels);

    $(window).scroll(function(){
        window_scrollY = window.pageYOffset; // declare variable here for screen not to scroll when closing modals

    });

    // Collapse all .post.open 
    var allPostButton = $('<li></li>').addClass('userMenu-collapsePosts').append('<a href="#">Collapse All</a>');
    $('.mini-profile-indicators').append(allPostButton);
    $(allPostButton).children('a').on('click', function(e) {
        var allPost =  $('#posts .post.open');
        allPost.each(function(){
        if (e.button === 0 && window.getSelection() == 0)
            postExpandFunction(e, $(this));
        });
        return false
    });


});

function testRightSide() { // if rightside is empty, don't show it and engarge postboard
    if( ( $('.toptrends').html() == '' ) && ($('.who-to-follow').html() == '') && ( $('.twistday-reminder').html() == '' ) ){
        $('.dashboard.right').css('display: none');
        $('.wrapper .postboard').addClass('large');
    }
    else {
        $('.dashboard.right').css('display: block');
        $('.wrapper .postboard').removeClass('large');
    }
}

function reOrganizeTemplates() { // for nin's templating

    reAppendModules();

    //removes unused html
    $('.modal-close').html('');
    $('.modal-back').html('');
    $('.twister-user-remove').html('');
    $('.profile-card-main').attr('style', '');
    $('.mini-profile-actions span').html('');

    //group chat 
    $('.mini-profile-indicators li.userMenu-groupmessages a span:last-child ').html('Group Msg');

    $('button.invite').html('invite');
    $('button.leave').html('leave');
    $('.secret-key').attr('title', 'copy secret key');

    //re-organizes
    $('.promoted-posts-only').detach().appendTo($('.left .mini-profile'));
    $('.mini-profile .open-following-page').parent('li').detach().appendTo($('.mini-profile-indicators'));
    $('.mini-profile-indicators').detach().insertAfter($('.dashboard.left .profile-data'));

    ///// page profile 
    $('.forEdition .profile-card-main h2').detach().insertBefore($('.profile-card-main'));

    //loader
    newLoader()

    // new post button
    $('<li></li>')
        .addClass('userMenu-newPost')
        .prependTo('.mini-profile-indicators');
    $('<a href="#">New post</a>')
        .addClass('ion')
        .addClass('ion-plus')
        .appendTo('.userMenu-newPost')
        .bind( 'click', function() {
            if(!$('.mini-profile .post-area').hasClass('display')) {$('.mini-profile .post-area').addClass('display');}
            else  {$('.mini-profile .post-area').removeClass('display');}
            return false;
    });

    // new post prompt
    $('<div><h3>New post</h3><span class="modal-close prompt-close"></span></div>')
        .addClass('modal-header')
        .prependTo('.mini-profile .post-area');

    $('.mini-profile .post-area .post-submit').bind( 'click', function() {
        $('.mini-profile .post-area').removeClass('display');
    });
    $('.mini-profile .post-area .modal-close').bind( 'click', function() {
        $('.mini-profile .post-area').removeClass('display');
    });

    // button "follow" in search
    // not very nice but works
    $('li:not(.twister-user) button.follow').html('+').attr('title',polyglot.t('Follow'));
    $('li:not(.twister-user) button.follow')
        .on("eventToggleFollow", function() {
            $(this).text('+').attr('title', polyglot.t('Follow'));
        })
        .on("eventToggleUnfollow", function() {
            $(this).text('-').attr('title', polyglot.t('Unfollow'));
        });    
}

// Close new post prompt with esc key
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        $('.mini-profile .post-area').removeClass('display');
        closeModal();
    }
});

function reAppendModules() { // avoid w1200 things
    $('.module.toptrends').detach().appendTo($('.dashboard.right'));
    $('.module.who-to-follow').detach().appendTo($('.dashboard.right'));
    $('.module.twistday-reminder').detach().appendTo($('.dashboard.right'));
}

function newLoader() { // create divs for new loader
    $('<div></div>').appendTo('.postboard-loading');
    $('<div></div>').appendTo('.postboard-loading');
    $('<div></div>').appendTo('.postboard-loading');
}

function localizeLabels() {
    $("label[for=tab_language]").text(polyglot.t("Language"));
    $("label[for=t-2]").text(polyglot.t("Theme"));
    $("label[for=t-3]").text(polyglot.t("Notifications"));
    $("label[for=t-4]").text(polyglot.t("Keys"));
    $("label[for=t-5]").text(polyglot.t("Appearance"));
    $("label[for=t-6]").text(polyglot.t("Users"));
}

function openModal(modal) {
    
    var windowHeight = $(window).height();
    if (!modal.classBase)
        modal.classBase = '.modal-wrapper';

    $(modal.classBase + ':not(#templates *)').remove();

    modal.self = $('#templates ' + modal.classBase).clone(true)
        .addClass(modal.classAdd);

    if (modal.title)
        modal.self.find('.modal-header h3').html(modal.title);
    if (modal.content)
        modal.content = modal.self.find('.modal-content')
            .append(modal.content);
    else
        modal.content = modal.self.find('.modal-content');
        modal.postboard = modal.self.find('.postboard-posts');

        modal.self.prependTo('body').slideDown();
     

    if (modal.classBase === '.modal-wrapper') {
        modal.content.outerHeight(modal.self.height() - modal.self.find('.modal-header').outerHeight());

        if (modal.self.outerHeight() > windowHeight) {
            modal.content.outerHeight(modal.content.outerHeight() - modal.self.outerHeight() + windowHeight);
            modal.self.outerHeight(windowHeight);
            modal.self.css('margin-top', - windowHeight / 2);
        }
    }
    return modal;
}
