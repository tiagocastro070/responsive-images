var respImages = (function(){
    
    function respImages(options){
        if (!document.querySelector) return;
        
        // Define default options
        var defaults = {
            crop: true,
            selector: '.resp-image',
            timeInterval: 250,
            breakpoints: [200, 400, 600, 800],
			urlPath: 'i/$width/$height/$crop1/$crop2/$image',
			resizeTarget: 'highest' // could be highest or normal 
        }
        
        // Replace defaults with user settings
        for (var k in options) {
            if (options.hasOwnProperty(k)) {
                defaults[k] = options[k];
            }
        }

		var timer = defaults.timeInterval,
        	elements = document.querySelectorAll( defaults.selector ),
            element,
			elementFill,
			elementSrc,
			elementDataSrc,
			elementRatio,
			parentWidth,
			elementWidth,
			imgURL,
			backURL,
			fullPath,
            fakeImg,
            resizeTimer;
        

        window.addEventListener('resize', function() {
			// wait X miliseconds before run
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
				
                resizeImages();
				
            }, timer);
        });
		
		function resizeImages() {
			for ( var i = 0; i < elements.length; i++ ) {
				
				// single img
				element = elements[i];
				// get base path structure
				imgURL = defaults.urlPath; 
				backURL = defaults.urlPath;
                
				if ( element.nodeName == 'IMG' ) {
					
					// check if it is necessary to download a new image
					if ( element.naturalWidth < closestBreakpoint( defaults.breakpoints, element.parentElement.clientWidth, defaults.resizeType) ) {
					
						elementSrc 		= element.getAttribute('src');
						elementDataSrc 	= element.getAttribute('data-filename');
						elementRatio	= element.clientWidth / element.clientHeight;
						parentWidth 	= element.parentElement.clientWidth;

						imgURL = imgURL.replace( '$width', closestBreakpoint( defaults.breakpoints, parentWidth, defaults.resizeType)); // call array name and desired value to be closest
						imgURL = imgURL.replace( '$height', Math.floor((closestBreakpoint( defaults.breakpoints, parentWidth, defaults.resizeType) * element.clientHeight) / element.clientWidth) );
						imgURL = imgURL.replace( '$crop1', '1' );
						imgURL = imgURL.replace( '$crop2', '0' );
						imgURL = imgURL.replace( '$image', elementDataSrc ); // original filename

						// full image path
						fullPath = extractDomain(elementSrc) + '/' + imgURL;

						// replace img src
						replaceImg(fullPath, element);
						
					}
					
				} else {
					
					// div background image
					elementSrc 		= element.getAttribute('style');
					elementDataSrc 	= element.getAttribute('data-filename');
					elementWidth 	= element.parentElement.clientWidth;
					// call array name and desired value to be closest
					backURL = backURL.replace( '$width', closestBreakpoint( defaults.breakpoints, elementWidth, defaults.resizeType));
					backURL = backURL.replace( '$height', Math.floor((closestBreakpoint( defaults.breakpoints, elementWidth, defaults.resizeType) * element.clientHeight) / element.clientWidth) );
					backURL = backURL.replace( '$crop1', '1' );
					backURL = backURL.replace( '$crop2', '0' );
					// original filename
					backURL = backURL.replace( '$image', elementDataSrc ); 
					
					// full image path
					fullPath = extractDomain(elementSrc) + '/' + backURL + '\');';

					// replace img src
					element.setAttribute('style', fullPath);

				}
				
			} // end for
		}
		
		// execute on start
		resizeImages();
		
    }
	
	
    
    function replaceImg(src, element) {
		
        fakeImg = new Image;
        fakeImg.onload = function() {
			element.src = this.src;
        }
        fakeImg.src = src;
    }
	
	
	// Find closest from array
	function closestBreakpoint( array, num, type ){

		if ( type == 'highest' ) { // target the nearest and highest breakpoint in array
			
			var MinGreaterThanPos;
			
			for (var i = 0; i < array.length; i++) {
				if (array[i] <= num) 
					continue;
			
				if (typeof(MinGreaterThanPos) == 'undefined' || array[i] < MinGreaterThanPos) {
					return array[i];
				}
			}

		} else { // target the nearest breakpoint in array

			var i = 0;
			var minDiff = 1000;
			var ans;
			for ( i in array ) {
				var m = Math.abs( num - array[i] ); 
				if ( m < minDiff ) { 
					minDiff = m; 
					ans = array[i]; 
				}
			}
			return ans;
			
		}
		
	}
	
	
	// Get domain path
	function extractDomain(url) {

		var splitDomain = url.split('/');
		var domain = splitDomain[0] + "//" + splitDomain[2];
		
		return domain;
		
	}
	

	// return
    return respImages;
})();


(function(){
    if (typeof define === 'function' && define.amd) {
        define('respImages', function () { return respImages; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = respImages;
    } else {
        window.respImages = respImages;
    }
})();



// Usage
// var someVar = new respImages({
// 	crop: true
// }); 