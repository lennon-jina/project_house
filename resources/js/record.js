$(function() { 
    const list = $('.bookmarked-building-list')[0];
    const prevButton = $('.prev-slide');
    const nextButton = $('.next-slide');
    const scrollAmount = 270; 

    prevButton.on('click', function() { 
        list.scrollBy({ 
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextButton.on('click', function() { 
        list.scrollBy({ 
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
});