let xmlDoc;
var textPlaceholder = 'Drop XML from App Designer Package Here';
var filePlaceholder = 'Drop XML from App Designer Package Here';
$('#user_input').attr('placeholder', textPlaceholder);
$('#user_input').keyup(function () {
    processChange();
});
$('#process').change(function () {
    processChange();
});
$('#user_input').on('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    currentText = $('#user_input').text();
    $('#user_input').css('background', '#eee');
    $('#user_input').attr('placeholder', filePlaceholder);
});
$('#user_input').on('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#user_input').text(currentText);
    $('#user_input').css('background', '#fff');
    $('#user_input').attr('placeholder', textPlaceholder);
});
$('#user_input').on('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var file = e.originalEvent.dataTransfer.files[0];
    var r = new FileReader();
    r.onload = function (f) {
        var contents = f.target.result;
        $('#user_input').css('background', '#fff');
        $('#user_input').attr('placeholder', textPlaceholder);
        contents = contents.replace("<?xml version='1.0'?>", "<?xml version='1.0'?><data>");
        contents += "</data>";
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(contents, "text/xml");
        var images = xmlDoc.evaluate('//instance[@class="CRM"]', xmlDoc, null, XPathResult.ANY_TYPE, null);
        var base64_images = {};
        var style_sheets = {};
        var curr_img = images.iterateNext();
        while (curr_img) {
            if (curr_img.getElementsByTagName('hContData')[0].getElementsByTagName('hContData').length > 0) {
                var img_name = curr_img.getElementsByTagName('szContName')[0].innerHTML;
                var b64_img = 'data:image;base64,' + curr_img.getElementsByTagName('hContData')[0].getElementsByTagName('hContData')[0].innerHTML;
                base64_images[img_name] = b64_img;
            } else {
                var ss_name = curr_img.getElementsByTagName('szContName')[0].innerHTML;
                var ss_text = curr_img.getElementsByTagName('hContStrData')[0].getElementsByTagName('hContStrData')[0].innerHTML;
                style_sheets[ss_name] = ss_text.split('\x0A').join('<br class="auto-added">');
            }
            curr_img = images.iterateNext();
        }
        var peoplecodes = xmlDoc.evaluate('//instance[@class="PCM"]', xmlDoc, null, XPathResult.ANY_TYPE, null);
        var peoplecode_text = {};
        var curr_ppc = peoplecodes.iterateNext();
        while (curr_ppc) {
            var name = getObjectName(curr_ppc);
            var ppc = curr_ppc.getElementsByTagName('peoplecode_text')[0].innerHTML;
            peoplecode_text[name] = ppc.split('\x0A').join('<br>');
            curr_ppc = peoplecodes.iterateNext();
        }
        var registry_defs_q = xmlDoc.evaluate('//instance[@class="PRSM"]', xmlDoc, null, XPathResult.ANY_TYPE, null);
        var registry_defs = {}
        var curr_reg = registry_defs_q.iterateNext();
        while (curr_reg) {
            var name = curr_reg.getElementsByTagName('szPortalName')[0].innerHTML + ' > ' + curr_reg.getElementsByTagName('cRefType')[0].innerHTML + ' > ' + curr_reg.getElementsByTagName('szObjName')[0].innerHTML;
            var url = curr_reg.getElementsByTagName('pszURLLogical')[0];
            if (url.getElementsByTagName('pszURLLogical').length > 0) {
                url = url.getElementsByTagName('pszURLLogical')[0].innerHTML;
                var location = curr_reg.getElementsByTagName('pszPath')[0].getElementsByTagName('pszPath')[0].innerHTML;
                registry_defs[name] = '<b>URL: </b><a target="_blank" rel="noopener noreferrer" href="' + url + '">' + url + '</a><br><b>Path: </b>' + location;
            }
            curr_reg = registry_defs_q.iterateNext();
        }
        var sql_stmts = {};
        var sql_stmts_q = xmlDoc.evaluate('//instance[@class="SRM"]', xmlDoc, null, XPathResult.ANY_TYPE, null);
        var curr_sql = sql_stmts_q.iterateNext();
        while (curr_sql) {
            var name = curr_sql.getElementsByTagName('szSqlId')[0].innerHTML + ' > ' + curr_sql.getElementsByTagName('szSqlType')[0].innerHTML;
            var sql_code = curr_sql.getElementsByTagName('lpszSqlText')[0].getElementsByTagName('lpszSqlText')[0].innerHTML;
            sql_stmts[name] = sql_code;
            curr_sql = sql_stmts_q.iterateNext();
        }
        $('#project-name').css('display', 'block');
        $('#project-name').text(xmlDoc.getElementsByTagName('szProjectName')[0].innerHTML);
        var lpPit = xmlDoc.getElementsByTagName('lpPit')[0]
        var rowset = lpPit.getElementsByTagName('rowset')[0];
        var objects = rowset.getElementsByTagName('row');
        var objectCount = Number(xmlDoc.getElementsByTagName('nProjectCount')[0].innerHTML)
        var objectNames = [];
        var objectTypes = {
            "0": "Record",
            "1": "Indexes",
            "2": "Fields",
            "3": "Field Formats",
            "4": "Translates",
            "5": "Pages",
            "6": "Menus",
            "7": "Components",
            "8": "Record PeopleCode",
            "9": "Menu PeopleCode",
            "10": "Queries",
            "11": "Tree Structures",
            "12": "Trees",
            "13": "Access Groups",
            "14": "Colours",
            "15": "Styles",
            "17": "Business Processes",
            "18": "Activities",
            "19": "Roles",
            "20": "Process Definitions",
            "21": "Server Definitions",
            "22": "Process Type Definitions",
            "23": "Job Definitions",
            "24": "Recurrence Definitions",
            "25": "Message Catalog Entries",
            "26": "Dimension Definition",
            "27": "Cube Definition",
            "28": "Cube Instance Definition",
            "29": "Business Interlink",
            "30": "SQL",
            "31": "File Layout Definitions",
            "32": "Component Interfaces",
            "33": "Application Engine Programs",
            "34": "Application Engine Sections",
            "35": "Message Nodes",
            "36": "Message Channels",
            "37": "Message Definitions",
            "38": "Approval Rule Set",
            "39": "Message PeopleCode",
            "40": "Subscription PeopleCode",
            "42": "Comp. Interface PeopleCode",
            "43": "Application Engine PeopleCode",
            "44": "Page PeopleCode",
            "46": "Component PeopleCode",
            "47": "Component Record PeopleCode",
            "48": "Component Rec Fld PeopleCode",
            "49": "Images",
            "50": "Style Sheets",
            "51": "HTML",
            "52": "File References",
            "53": "Permission Lists",
            "54": "Portal Registry Definitions",
            "55": "Portal Registry Structures",
            "56": "URL Definitions",
            "57": "Application Packages",
            "58": "Application Package PeopleCode",
            "60": "Analytic Types",
            "62": "XSLT",
            "64": "Mobile Pages",
            "68": "File References",
            "69": "File Type Codes",
            "72": "Dignostic Plug Ins",
            "73": "Analytic Models",
            "79": "Service",
            "80": "Service Operation",
            "81": "Service Operation Handler",
            "82": "Service Operation Version",
            "83": "Service Operation Routing",
            "84": "IB Queues",
            "85": "XLMP Template Definition",
            "86": "XLMP Report Definition",
            "87": "XMLP File Definition",
            "88": "XMPL Data Source Definition"
        }
        upgradeActions = {
            "0": "",
            "1": "-",
            "2": "None",
            "3": "CopyProp"
        };
        var resultsStr = '';
        for (var i = 0; i < objects.length; i++) {
            var row = objects[i];
            var strrep = '',
                detailsStr = '<p>No details for this object at this time</p>';
            if (row.getElementsByTagName('eUpgradeAction').length < 1) {
                i = objects.length;
            }
            strrep += upgradeActions[row.getElementsByTagName('eUpgradeAction')[0].innerHTML] + ' ';
            strrep += objectTypes[row.getElementsByTagName('eObjectType')[0].innerHTML] + ': ';
            var name = getObjectName(row);
            strrep += name;
            objectNames.push(strrep);
            var objectType = Number(row.getElementsByTagName('eObjectType')[0].innerHTML);
            var objectName = row.getElementsByTagName('szObjectValue_0')[0].innerHTML;
            if (objectType === 49) {
                detailsStr = '<img src="' + base64_images[objectName] + '" style="max-width: 100%" >';
            } else if (objectType === 50 || objectType === 51) {
                detailsStr = '<pre><code>' + style_sheets[objectName] + '</code></pre>';
                if (objectType === 51) {
                    detailsStr += generateHTMLPreview(objectName, style_sheets[objectName]);
                }
            } else if ([8, 9, 39, 40, 42, 43, 44, 46, 47, 48, 58].includes(objectType)) {
                if (peoplecode_text[name] === undefined) name += " > OnExecute"
                detailsStr = '<pre><code>' + peoplecode_text[name] + '</code></pre>';
            } else if ([54, 55].includes(objectType)) {
                if (registry_defs[name] !== undefined) {
                    detailsStr = registry_defs[name];
                }
            } else if ([30].includes(objectType)) {
                detailsStr = '<pre><code>' + sql_stmts[name] + '</code></pre>';
            }
            var highlight = detailsStr == '<p>No details for this object at this time</p>' ? '' : ' selectable'
            resultsStr += '<dt class="accordion__header' + highlight + '"> ' + strrep + ' </dt><dd class="accordion__content">' + detailsStr + '</dd>'
        }
        $('#result').html(resultsStr);
        resetupAccordions();
    }
    r.readAsText(file);
});
$('#copy_text').click(function () {
    $('#result').select();
    try {
        var success = document.execCommand('copy');
        if (!success) throw 'shucks';
    } catch (e) {
        window.prompt('Your browser doesn\'t support auto-copying, please copy the preselected text below:', $('#result').text());
    }
});

function processChange() {
    var newVal = '';
    var inputVal = $('#user_input').val();
    switch ($('#process').val()) {
        case 'url_encode':
            newVal = encodeURIComponent(inputVal);
            break;
        case 'url_decode':
            newVal = decodeURIComponent(inputVal);
            break;
        case 'base64_encode':
            newVal = window.btoa(inputVal);
            break;
        case 'base64_decode':
            newVal = window.atob(inputVal);
            break;
        case 'csun_cas_gen':
            newVal = 'https://auth.csun.edu/cas/login?method=POST&service=' + encodeURIComponent(inputVal);
            break;
        case 'csun_dev_cas_gen':
            newVal = ' https://dev-cas.csun.edu/cas/login?method=POST&service=' + encodeURIComponent(inputVal);
            break;
        case 'csun_cas_ext':
            newVal = (inputVal.split('service=').length > 1) ? decodeURIComponent(inputVal.split('service=')[1]) : '';
            break;
    }
    $('#result').text(newVal);
}

function getObjectName(obj) {
    retVal = obj.getElementsByTagName('szObjectValue_0')[0].innerHTML;
    var val1 = obj.getElementsByTagName('szObjectValue_1')[0].innerHTML;
    if (val1.length > 0) retVal += ' > ' + val1;
    var val2 = obj.getElementsByTagName('szObjectValue_2')[0].innerHTML;
    if (val2.length > 0) retVal += ' > ' + val2;
    return retVal;

}

function generateHTMLPreview(name, html) {
    return generateModal(name, 'Preview HTML', 'HTML Preview', html);
}

function generateModal(id, button_label, title, content) {

    modal = '<button class="btn btn-default" data-modal="#' + id + '">';
    modal += button_label;
    modal += '</button><div id="' + id + '" class="modal__outer"><div class="modal"><div class="modal__header"><strong>';
    modal += title;
    modal += '</strong></div><div class="modal__content">';
    var txt = document.createElement("textarea");
    txt.innerHTML = content.split('<br class="auto-added">').join('');
    content = txt.value;
    modal += content;
    modal += '</div><div class="modal__footer"><div class="pull-right"><button class="btn btn-primary" data-modal-close="#' + id + '">Done</button></div></div><div class="modal__close" data-modal-close="#' + id + '"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>';
    return modal;
}

function resetupAccordions() {
    (function ($) {
        'use strict';
        // Vars
        var accordion = $('.accordion'),
            accordionHeader = $('.accordion__header'),
            accordionContent = $('.accordion__content'),
            showOneAnswerAtATime = false;
        /**
         * Save question focus
         */
        var saveFocus = function (elem, thisAccordionHeaders) {
            // Reset other tab attributes
            thisAccordionHeaders.each(function () {
                $(this).attr('tabindex', '-1');
                $(this).attr('aria-selected', 'false');
            });
            // Set this tab attributes
            elem.attr({
                'tabindex': '0',
                'aria-selected': 'true'
            });
        };
        /**
         * Show answer on click
         */
        var showHeader = function (elem, thisAccordionHeaders) {
            var thisFaqAnswer = elem.next();
            // Save focus
            saveFocus(elem, thisAccordionHeaders);
            // Set this tab attributes
            if (thisFaqAnswer.hasClass('accordion__content--show')) {
                // Hide answer
                thisFaqAnswer.removeClass('accordion__content--show');
                elem.attr('aria-expanded', 'false');
                thisFaqAnswer.attr('aria-hidden', 'true');
            } else {
                if (showOneAnswerAtATime) {
                    // Hide all answers
                    accordionContent.removeClass('accordion__content--show').attr('aria-hidden', 'true');
                    accordionHeader.attr('aria-expanded', 'false');
                }
                // Show answer
                thisFaqAnswer.addClass('accordion__content--show');
                elem.attr('aria-expanded', 'true');
                thisFaqAnswer.attr('aria-hidden', 'false');
            }
        };
        /**
         * Keyboard interaction
         */
        var keyboardInteraction = function (elem, e, thisAccordionHeaders) {
            var keyCode = e.which,
                nextQuestion = elem.next().next().is('dt') ? elem.next().next() : false,
                previousQuestion = elem.prev().prev().is('dt') ? elem.prev().prev() : false,
                firstQuestion = elem.parent().find('dt:first'),
                lastQuestion = elem.parent().find('dt:last');
            switch (keyCode) {
                // Left/Up
                case 37:
                case 38:
                    e.preventDefault();
                    e.stopPropagation();
                    // Check for previous question
                    if (!previousQuestion) {
                        // No previous, set focus on last question
                        lastQuestion.focus();
                    } else {
                        // Move focus to previous question
                        previousQuestion.focus();
                    }
                    break;
                    // Right/Down
                case 39:
                case 40:
                    e.preventDefault();
                    e.stopPropagation();
                    // Check for next question
                    if (!nextQuestion) {
                        // No next, set focus on first question
                        firstQuestion.focus();
                    } else {
                        // Move focus to next question
                        nextQuestion.focus();
                    }
                    break;
                    // Home
                case 36:
                    e.preventDefault();
                    e.stopPropagation();
                    // Set focus on first question
                    firstQuestion.focus();
                    break;
                    // End
                case 35:
                    e.preventDefault();
                    e.stopPropagation();
                    // Set focus on last question
                    lastQuestion.focus();
                    break;
                    // Enter/Space
                case 13:
                case 32:
                    e.preventDefault();
                    e.stopPropagation();
                    // Show answer content
                    showHeader(elem, thisAccordionHeaders);
                    break;
            }
        };
        /**
         * On load, setup roles and initial properties
         */
        // Each FAQ Question
        accordionHeader.each(function (i) {
            $(this).attr({
                'id': 'accordion__header--' + i,
                'role': 'tab',
                'aria-controls': 'accordion__content--' + i,
                'aria-expanded': 'false',
                'aria-selected': 'false',
                'tabindex': '-1'
            });
        });
        // Each FAQ Answer
        accordionContent.each(function (i) {
            $(this).attr({
                'id': 'accordion__content--' + i,
                'role': 'tabpanel',
                'aria-labelledby': 'accordion__header--' + i,
                'aria-hidden': 'true'
            });
        });
        // Each FAQ Section
        accordion.each(function () {
            var $this = $(this),
                thisAccordionHeaders = $this.find('.accordion__header');
            // Set section attributes
            $this.attr({
                'role': 'tablist',
                'aria-multiselectable': 'true'
            });
            thisAccordionHeaders.each(function (i) {
                var $this = $(this);
                // Make first tab clickable
                if (i === 0) {
                    $this.attr('tabindex', '0');
                }
                // Click event
                $this.on('click', function () {
                    showHeader($(this), thisAccordionHeaders);
                });
                // Keydown event
                $this.on('keydown', function (e) {
                    keyboardInteraction($(this), e, thisAccordionHeaders);
                });
                // Focus event
                $this.on('focus', function () {
                    saveFocus($(this), thisAccordionHeaders);
                });
            });
        });
    })(jQuery);
    (function ($) {
        var doc = $(document);
        // NAV
        var navBtn = $(".primary-nav__btn");
        var navLinks = $(".primary-nav__links");
        navBtn.on("click", function () {
            navLinks.toggleClass("primary-nav__links--open");
        });
        // SUB NAV
        if (doc.hasClass('sub-nav')) {
            var subNav = $(".sub-nav");
            var subNavTop = subNav.offset().top;
            var subnavBtn = $(".sub-nav__btn");
            var subnavLinks = $(".sub-nav__links");
            subnavBtn.on("click", function () {
                subnavLinks.toggleClass("sub-nav__links--open");
            });
            $(window).scroll(function () {
                if ($(this).scrollTop() > subNavTop) {
                    subNav.addClass("sub-nav--fixed");
                } else {
                    subNav.removeClass("sub-nav--fixed");
                }
            });
        }
        // DATEPICKER
        var d = $(".datepicker");
        d.datepicker({
            // minDate: new Date(),
            nextText: '<i class="fa fa-caret-right"></i>',
            prevText: '<i class="fa fa-caret-left"></i>'
        });
        // MODALS
        $('*[data-modal]').click(function (e) {
            e.preventDefault();
            var target = $(this).data('modal');
            $(target).addClass('modal--show');
        });
        // Close Modal Button
        $('*[data-modal-close]').click(function (e) {
            e.preventDefault();
            $(document).find('.modal__outer.modal--show').removeClass('modal--show');
        });
        // Close Alerts
        var closeLinks = $('*[data-alert-close]');
        closeLinks.on('click', closeHandleMethod);

        function closeHandleMethod(e) {
            e.preventDefault();
            $(this).parent().hide();
        }
        // Close Tag
        $('.tag--close').on('click', function (e) {
            e.preventDefault();
            $(this).hide();
        });
    })(jQuery);
}