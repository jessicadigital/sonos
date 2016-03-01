(function($){

    function secondsToTime(seconds) {
        if (seconds < 60) {
            return seconds+'s';
        }
        else {
            return Math.floor(seconds/60)+'m '+Math.floor(seconds%60)+'s';
        }
    }

    function loadCurrentTrack() {
        $.ajax({
            data:{},
            dataType:'json',
            error:function(xmlhttpr, textStatus, errorThrown) {
                console.error(errorThrown);
            },
            success:function(data, textStatus, xmlhttpr) {
                $('.currenttrack h1').text(data['title']);
                $('.currenttrack h2').text(data['artist']);
                $('.currenttrack h3').text(data['album']);
                $('.currenttrack').css('backgroundImage', 'url('+data['artwork']+')');
                $('.currenttrack .progress').css('width', ((data['duration']['now']/data['duration']['total'])*100)+'%');
                $('.currenttrack .progress-inner').html(secondsToTime(data['duration']['now'])+'/'+secondsToTime(data['duration']['total']));
                setTimeout(function() {
                    loadCurrentTrack();
                }, 1000);
            },
            type:'POST',
            url:'/currenttrack'
        });
    }

    loadCurrentTrack();
})(jQuery);
