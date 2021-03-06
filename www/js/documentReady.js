// Funcao Ready - Executa toda vez que o APP for aberto, seja local ou no mobile
$('window').ready(function($) {

    /* Definicoes para voce customizar o APP, precisamos simplificar em outro arquivo */
    var title = 'App Base';
    var logo  = '/img/logo.png';
    var backend_server = '';
    var backend_local = 'http://backend.app';

    /* Definicoes padroes do APP */
    storage = window.localStorage;

    /* Define o server automaticamente para uso posterior */
    server = (navigator.app ? backend_server : backend_local);

    /* Aplica as alteraçoes no DOM com os parametros definidos no inicio */
    $('title,.title').html(title); // Troca os Titulos
    $('.logo').attr('src', logo); // Troca os Logos

    /* Chamadas para configurar o APP */

    // Controles de Auth
    if (storage.getItem('user') == null) {
        // $('nav').hide();
        $('section').hide();
        $('#login').show();
        $('#titulo').html('Login');
    } else {
        logar();
    }

    $('#login_action').on('click', function(e) {
        // Testar com Curl no SHELL>  curl -d "email=email@email.com&password=senha" -X POST http://backend.app/api/auht/login
        console.clear();
        var btn = $(this);
        btn.html('<i class="fa fa-spinner fa-spin"></i>')
        $.post( server+'/api/auth/login', { 'email':$('#email').val(), 'password':$('#password').val() })
        .done(function( data ) {
            if (data.error) {
                btn.html(data.error);
            } else {
                btn.html(data.success);
                storage.setItem('user', JSON.stringify(data));
                logar();
            }
        });
    });

    // Função que validar se está logado e esconde tela de login
    function logar() {
        user = JSON.parse(storage.getItem('user')).user;
        $("[href='#inicio']").click();
        $("[href='#inicio']").show();  
        $("[href='#login']").hide();
    }

    // Grava total de vezes que o usuario ja abriu o APP
    var access  =+ storage.getItem('TotalDeAcessos');
    storage.setItem('TotalDeAcessos', access + 1 );

    /* De Layout */

    // FastClick
    FastClick.attach(document.body); 

    // Um Controlador para o Menu, simples mas funcional
    $('nav').on('click', 'li a', function(event) { 
        event.preventDefault();
        var id = $(this).attr('href');
        $('section').hide();
        $('#titulo').html($(this).html());
        $(id).show();
    });

    // Menu Responsivo
    $(".button-collapse").sideNav({
        edge: 'left',
        menuWidth: 250, 
        closeOnClick: true
    });

    // Modal Materialize
    $('.modal-trigger').leanModal();

    /* Fixa o Menu quando houver Scroll */
    var nav = $('#menu-fixar');
    $(window).scroll(function () { 
        console.log(nav);
        if ($(this).scrollTop() > 50) { 
            nav.addClass("menu-fixo"); 
        } else { 
            nav.removeClass("menu-fixo"); 
        } 
    });

})