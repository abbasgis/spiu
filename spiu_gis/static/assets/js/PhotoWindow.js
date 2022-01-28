/**
 * Created by Shakir on 5/16/2015.
 */
var PhotoWindow = function (olMapModel) {
    var me = this;
    me.olMapModel = olMapModel;
    me.win = null;
    me.createPhotoViewerWindowImages = function (data, asset_id) {
        //     var data = '[{"image_path":"assets/0434141237/images/14_3.jpg"},{"image_path":"assets/0434141237/images/19_1.jpg"},{"image_path":"assets/0434141237/images/16_2.jpg"} ]';
        data = eval("(" + data + ")");
        var imgSliderHTML = me.getSliderHTMLTags(data);
        //    var imgTags = '';
        //    for (var i = 0; i < data.length; i++) {
        //        var photoPath=data[i].image_path;
        //        photoPath = photoPath.replace("../", "");
        //        var imgURL = "http://104.238.103.127/epms/survey/" + photoPath;
        //        imgTags = imgTags + '<a href='+imgURL+' target="_blank"><img src='+imgURL+' style="max-width: 100%;max-height: 100%"/></a>';
        //
        //    }
        //    var photoPath=data[0].image_path;
        //    photoPath = photoPath.replace("../", "");
        //    var imgURL = "http://104.238.103.127/mamis/survey/tma/" + photoPath;
        //    imgTags = imgTags + '<a href='+imgURL+' target="_blank"><img src='+imgURL+' style="max-width: 100%;max-height: 100%"/></a>';
        ////    var myHtml = '<div id="sliderFrame"><div id="slider">' + imgTags + '</div></div>';
        //    var myHtml = '<div id="slider" style=" width:100%; height:100%;" ><figure>' + imgTags + '</figure></div>'
        var rotateDeg = [90, 90, 90];
        var zoomStep = [2.5, 2.5, 2.5];
        var winPhoto = Ext.getCmp("photoWin");
        if (winPhoto) {
            winPhoto.destroy();
        }
        if (!me.win) {
            me.win = Ext.create('Ext.window.Window', {
                id: 'photoWin',
                title: 'Photo Attached = (' + data.length + ')',
                //   layout:'fit',
                width: 500,
                height: 500,
                closeAction: 'destroy',
                preventBodyReset: true,
                // maximizable: true,
                constrainHeader: true,
                collapsible: true,
                plain: true,
                html: imgSliderHTML,
                // buttons: [
                //     {
                //         text: 'Rotate',
                //         handler: function () {
                //             var temp = document.createElement('div');
                //             temp.innerHTML = me.win.el.dom.getElementsByClassName("slides")[0].parentElement.innerHTML;//document.getElementById("photoWin-innerCt").innerHTML; //me.win.el.dom.innerHTML;
                //             var htmlObject = temp.getElementsByClassName("slide");
                //             for (var i = 0; i < htmlObject.length; i++) {
                //                 var domElem = me.win.el.dom.getElementsByTagName("input");
                //                 var tempElem = temp.getElementsByTagName("input");
                //                 tempElem.innerHTML = domElem.innerHTML;
                //                 // alert(domElem[i].checked+" temp "+tempElem[i].checked);
                //                 if (domElem[i].checked) {
                //                     htmlObject[i].style.WebkitTransform = "rotate(" + rotateDeg[i] + "deg)";
                //                     //    rotateDeg[i]=rotateDeg[i]+90;
                //                     tempElem[i].checked = true;
                //                     me.win.update(temp.innerHTML);
                //                     domElem[i].checked = true;
                //                     var rotateurl = '/mamis/rotate_image/?asset_id=' + asset_id + '&rotate_angel=' + rotateDeg[i] + '&image_no=' + i;
                //                     Ext.Ajax.timeout = 900000;
                //                     Ext.Ajax.request({
                //                         url: rotateurl,
                //                         method: "GET",
                //                         success: function (response) {
                //                             var imgSliderHTML = me.getSliderHTMLTags(data);
                //                             me.win.update(imgSliderHTML);
                //                         },
                //                         failure: function (res) {
                //                             Ext.MessageBox.hide();
                //                         }
                //
                //                     });
                //                 } else {
                //                     tempElem[i].checked = false;
                //                 }
                //
                //             }
                //             me.win.doLayout();
                //         }
                //     }
                //     //    //,{
                //     //    //    text: 'ZoomIn',
                //     //    //    handler: function () {
                //     //    //        var temp = document.createElement('div');
                //     //    //        temp.innerHTML = document.getElementById("photoWin-innerCt").innerHTML; //me.win.el.dom.innerHTML;
                //     //    //        var htmlObject = temp.getElementsByClassName("slide");
                //     //    //        for(var i=0;i<htmlObject.length;i++){
                //     //    //            var domElem = me.win.el.dom.getElementsByTagName("input");
                //     //    //            var tempElem = temp.getElementsByTagName("input");
                //     //    //            tempElem.innerHTML =domElem.innerHTML;
                //     //    //            if (domElem[i].checked){
                //     //    //                htmlObject[i].style.msTransform=" scale("+zoomStep[i]+","+zoomStep[i]+")";
                //     //    //                zoomStep[i]=zoomStep[i]+0.5;
                //     //    //                me.win.update(temp.innerHTML);
                //     //    //                domElem[i].checked=true;
                //     //    //            }
                //     //    //            else {
                //     //    //                tempElem[i].checked = false;
                //     //    //            }
                //     //    //
                //     //    //        }
                //     //    //        me.win.doLayout();
                //     //    //    }
                //     //    //}
                // ]
            });
        } else {
            me.win.update(imgSliderHTML);
            //  winPhoto.update(myHtml);
        }
        me.win.show();
    };
    me.getPhotosURLFromDB = function (asset_id) {
        var me = this;
        var url = '/get_survey_photos/?srno=' + asset_id;
        Ext.Ajax.timeout = 900000;
        Ext.Ajax.request({
            url: url,
            method: "GET",
            success: function (response) {
                var respnseText = response.responseText;
                me.createPhotoViewerWindowImages(respnseText, asset_id);
            },
            failure: function (res) {
                Ext.MessageBox.hide();
            }

        });
    };
    me.getSliderHTMLTags = function (data) {
        var sliderHTML = '<ul class="slides">'
        var navDots = '<li class="nav-dots">';
        var inputTags = '';
        var myhtml = '';
        for (var i = 0; i < data.length; i++) {
            var j = i + 1;
            var k = i - 1;
            var photoPath = data[i].image_path;
            // photoPath = photoPath.replace("../", "");
            var imgURL = "http://103.226.217.48:83/corona/" + photoPath + '?cache=none';
            // if (photoPath.indexOf("uploaded") > 0) {
            //     imgURL = "http://176.9.118.199:88/media" + photoPath + '?cache=none';
            // }
            var imgID = 'img-' + i;
            var imgDotID = 'img-dot-' + i;
            var nextImgID = 'img-' + j;
            var prevImgID = '';
            var inputTag = '';
            if (i == 0) {
                var lastID = data.length - 1;
                prevImgID = 'img-' + lastID;
                inputTag = '<input type="radio" name="radio-btn" id="' + imgID + '" checked />';
            } else {
                prevImgID = 'img-' + k;
                inputTag = '<input type="radio" name="radio-btn" id="' + imgID + '"/>';
            }
            if (i == data.length - 1) {
                nextImgID = 'img-' + 0;
            }
            myhtml = myhtml + inputTag;
            var imgUrlTime = imgURL + '?' + (new Date().getTime());
            //  inputTags = inputTags+inputTag;
            navDots = navDots + '<label for=' + imgID + ' class="nav-dot" id="' + imgDotID + '"></label>';
            // myhtml = myhtml+'<li class="slide-container" id = "test"><div class="slide"><a href='+imgURL+' target="_blank"><img src='+imgURL+' /></a></div><div class="nav"><label for="'+prevImgID+'" class="prev">&#x2039;</label><label for="'+nextImgID+'" class="next">&#x203a;</label></div></li>';
            myhtml = myhtml + '<li class="slide-container" id = "test"><div class="slide"><a href=' + imgUrlTime + ' target="_blank"><img src=' + imgUrlTime + ' /></a></div><div class="nav"><label for="' + prevImgID + '" class="prev">&#x2039;</label><label for="' + nextImgID + '" class="next">&#x203a;</label></div></li>';

            //console.log(imgUrlTime);
        }
        navDots = navDots + '</li>';
        sliderHTML = sliderHTML + navDots;
        // sliderHTML = sliderHTML+inputTags;
        sliderHTML = sliderHTML + myhtml;
        sliderHTML = sliderHTML + '</ul>';
        return sliderHTML;
    }
    me.getDocumentSliderHTMLTags = function (data) {
        var sliderHTML = '<ul class="slides">'
        var navDots = '<li class="nav-dots">';
        var inputTags = '';
        var myhtml = '';
        for (var i = 0; i < data.length; i++) {
            var j = i + 1;
            var k = i - 1;
            var docPath = data[i].document_path;

            docPath = docPath.replace("../", "");
            //  var imgURL = "http://104.238.111.145/epms/" + photoPath+'?cache=none';
            var imgURL = "http://103.226.217.48:83/" + docPath + '?cache=none';
            var imgID = 'img-' + i;
            var imgDotID = 'img-dot-' + i;
            var nextImgID = 'img-' + j;
            var prevImgID = '';
            var inputTag = '';
            if (i == 0) {
                var lastID = data.length - 1;

                prevImgID = 'img-' + lastID;
                inputTag = '<input type="radio" name="radio-btn" id="' + imgID + '" checked />';
            } else {
                prevImgID = 'img-' + k;
                inputTag = '<input type="radio" name="radio-btn" id="' + imgID + '"/>';
            }
            if (i == data.length - 1) {
                nextImgID = 'img-' + 0;
            }
            myhtml = myhtml + inputTag;
            var imgUrlTime = imgURL + '?' + (new Date().getTime());

            //  inputTags = inputTags+inputTag;
            navDots = navDots + '<label for=' + imgID + ' class="nav-dot" id="' + imgDotID + '"></label>';
            // myhtml = myhtml+'<li class="slide-container" id = "test"><div class="slide"><a href='+imgURL+' target="_blank"><img src='+imgURL+' /></a></div><div class="nav"><label for="'+prevImgID+'" class="prev">&#x2039;</label><label for="'+nextImgID+'" class="next">&#x203a;</label></div></li>';
            myhtml = myhtml + '<li class="slide-container" id = "test"><div class="slide"><a href=' + imgUrlTime + ' target="_blank"><img src=' + imgUrlTime + ' /></a></div><div class="nav"><label for="' + prevImgID + '" class="prev">&#x2039;</label><label for="' + nextImgID + '" class="next">&#x203a;</label></div></li>';

            //console.log(imgUrlTime);
        }
        navDots = navDots + '</li>';
        sliderHTML = sliderHTML + navDots;
        // sliderHTML = sliderHTML+inputTags;
        sliderHTML = sliderHTML + myhtml;
        sliderHTML = sliderHTML + '</ul>';
        return sliderHTML;
    }

}