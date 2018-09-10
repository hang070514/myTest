    window.onload=function () {
    IEVersion();
        function IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    console.log('is ie8');
                    return 8;
                } else if(fIEVersion == 9) {
                    //grayscale();
                    console.log('is ie9 ba');
                    return 9;
                } else if(fIEVersion == 10) {
                    grayscale();
                    console.log('is ie10');
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }
            } else if(isEdge) {
                console.log('is edge');
                return 'edge';//edge

            } else if(isIE11) {
                grayscale();
                console.log('is ie11');
                return 11; //IE11
            }else{
                return -1;//不是ie浏览器
            }
        }

        /*兼容ie10 11*/
        function grayscale() {
            var imgObj = document.getElementById('imgToGray');
            //var imgObj = $('#imgToGray');

            function gray(imgObj) {
                var canvas = document.createElement('canvas');
                var canvasContext = canvas.getContext('2d');

                var imgW = imgObj.width;
                var imgH = imgObj.height;
                canvas.width = imgW;
                canvas.height = imgH;

                canvasContext.drawImage(imgObj, 0, 0);
                var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

                for (var y = 0; y < imgPixels.height; y++) {
                    for (var x = 0; x < imgPixels.width; x++) {
                        var i = (y * 4) * imgPixels.width + x * 4;
                        var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                        imgPixels.data[i] = avg;
                        imgPixels.data[i + 1] = avg;
                        imgPixels.data[i + 2] = avg;
                    }
                }
                canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
                return canvas.toDataURL();
            }
            imgObj.src = gray(imgObj);
        }

    }

