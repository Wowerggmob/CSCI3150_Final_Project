/*global Drupal: false, jQuery: false */
/*jslint devel: true, browser: true, maxerr: 50, indent: 2 */

(function($) {
    Drupal.behaviors.littlehelp = {
        attach: function(context, settings) {

            // Replace <BR> with Comma on VP for Location column
            jQuery(".view-volunteer-opportunities .views-field-name br").replaceWith("<br/>");

            //OnClick Event : Activity Assignement
            if (jQuery("body.page-portal").length) {
                jQuery(document).on("click", ".activity_listing a", function(e) {
                    //Removed the comma from number
                    $activity_id = $(this).attr("data");
                    $activity_id = $activity_id.replace(/\,/g, '');
                    $activity_id = parseInt($activity_id);
                    $contact_id = $(this).attr("cid");
                    $is_new_accept_request = $(this).hasClass("new-accept-request");

                    $.ajax({
                        url: "/assign/activity/" + $activity_id + "/" + $contact_id,
                        success: function(data) {
                            if (data.status == 'success') {
                                var activity_id = data.activity_id;
                                var assignee_id = data.assignee_id;

                                //Redirect to Volunteer Opportunity Detail page
                                var redirect = "/portal/volunteer-opportunity-specifics_backup/" + activity_id + "/" + assignee_id;
                                if ($is_new_accept_request) {
                                    var destination = (new URLSearchParams(window.location.search)).get('destination');
                                    if (!destination) {
                                        destination = window.location.pathname + window.location.search;
                                    }
                                    redirect = "/portal/volunteer-opportunity-specifics/" + activity_id + "/" + assignee_id + "?destination=" + encodeURIComponent(destination);
                                }
                                window.location.href = redirect;
                            } else if (data.status == 'fail') {
                                alert("Request can be accepted by valid user with volunteer role only.");
                                return false;
                            }
                        }
                    });
                    return false;
                });

                jQuery(document).on("click", ".service-saturdays a", function(e) {
                    $activity_id = $(this).attr("data");
                    $activity_id = $activity_id.replace(/\,/g, '');
                    $activity_id = parseInt($activity_id);

                    jQuery('#dialog-confirm').dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: [{
                                text: "Confirm",
                                click: function() {
                                    $.ajax({
                                        url: "/assign/service-saturdays-activity/" + $activity_id,
                                        success: function(data) {
                                            if (data.status == 'success') {
                                                window.location.href = "/portal/service-saturdays-specifics/" + data.activity_id + "/" + data.assignee_id;
                                            } else if (data.status == 'fail') {
                                                alert("Request can be accepted by valid user.");
                                                return false;
                                            }
                                        }
                                    });
                                    jQuery(this).dialog("close");
                                }

                            },
                            {
                                text: "Cancel",
                                click: function() {
                                    jQuery(this).dialog("close");
                                }

                            }
                        ]
                    });
                    return false;
                });

                jQuery(document).on("click", ".snow-shoveling a", function() {
                    $activity_id = parseInt($(this).attr("data"));
                    $contact_id = parseInt($(this).attr("cid"));

                    jQuery('#dialog-confirm').dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: [{
                                text: "Confirm",
                                click: function() {
                                    $.ajax({
                                        url: "/assign/snow-shoveling-activity/" + $activity_id + "/" + $contact_id,
                                        success: function(data) {
                                            if (data.status == 'success') {
                                                window.location.href = "/portal/snow-shoveling-specifics/" + data.activity_id + "/" + data.assignee_id;
                                            } else if (data.status == 'fail') {
                                                alert("Request can be accepted by valid user with volunteer role only.");
                                                return false;
                                            }
                                        }
                                    });
                                    jQuery(this).dialog("close");
                                }

                            },
                            {
                                text: "Go Back",
                                click: function() {
                                    jQuery(this).dialog("close");
                                }

                            }
                        ]
                    });
                    return false;
                });

                jQuery(document).on("click", ".ditch-the-desk a", function() {
                    $activity_id = parseInt($(this).attr("data"));
                    $contact_id = parseInt($(this).attr("cid"));

                    jQuery('#dialog-confirm').dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: [{
                                text: "Confirm",
                                click: function() {
                                    $.ajax({
                                        url: "/assign/ditch-the-desk-activity/" + $activity_id + "/" + $contact_id,
                                        success: function(data) {
                                            if (data.status == 'success') {
                                                window.location.href = "/portal/ditch-the-desk-specifics/" + data.activity_id + "/" + data.assignee_id;
                                            } else if (data.status == 'fail') {
                                                alert("Request can be accepted by valid user.");
                                                return false;
                                            }
                                        }
                                    });
                                    jQuery(this).dialog("close");
                                }
                            },
                            {
                                text: "Cancel",
                                click: function() {
                                    jQuery(this).dialog("close");
                                }

                            }
                        ]
                    });
                    return false;
                });
            }

            // Empty the City/Geography select box to customized
            var city = document.getElementById('edit-name-1');
            $(city).append('<option value="' + 0 + '">' + "-Select-" + '</option>');
            $(city).find('option').not(':selected').remove();

            // Empty the Town/Neightbourhood select box to customized
            var town = document.getElementById('edit-name-2');
            $(town).append('<option value="' + 0 + '">' + "-Select-" + '</option>');
            $(town).find('option').not(':selected').remove();

            // Volunteer Search View: Select Child Tag as per selected Parent Tag
            var cityArr = [];
            jQuery("#edit-name").change(function(e) {
                var $tag = $(this).val();
                $.ajax({
                    url: "/get/child_tag/" + $tag,
                    success: function(data) {
                        if (data.status == "success") {
                            var city = document.getElementById('edit-name-1');
                            $(city).empty();
                            $selected = '';
                            $.each(data.result, function(k, v) {
                                $selected = '';
                                //$selected = 'selected="selected"';
                                $(town).empty();
                                $(city).append('<option ' + $selected + ' value="' + k + '">' + v + '</option>');
                                cityArr.push(k);
                            });
                        } else {
                            //alert("Enable to load data");
                            //return;
                        }
                    }
                });
            });

            // Volunteer Search View: Select Child-child Tag as per selected Parent Tag
            var townArr = [];
            jQuery("#edit-name-1").click(function(e) {
                var $tag = $(this).val();
                $.ajax({
                    url: "/get/child_tag/" + $tag,
                    success: function(data) {
                        var town = document.getElementById('edit-name-2');
                        if (data.status == "success") {
                            $(town).empty();
                            $selected = '';
                            $.each(data.result, function(k, v) {
                                $selected = '';
                                //$selected = 'selected="selected"';
                                $(town).append('<option ' + $selected + ' value="' + k + '">' + v + '</option>');
                                townArr.push(k);
                            });
                        } else {
                            $(town).empty();
                        }
                    }
                });
            });

            // Set the House Hold Name

            var last_name = jQuery("#edit-submitted-civicrm-1-contact-1-fieldset-fieldset-contact1-layout-1-civicrm-1-contact-1-contact-last-name").val();
            if (last_name !== 'undefined') {
                jQuery("#edit-submitted-civicrm-3-contact-1-contact-household-name").val('Family -' + last_name);
            }
            jQuery("#edit-submitted-civicrm-1-contact-1-fieldset-fieldset-contact1-layout-1-civicrm-1-contact-1-contact-last-name").keyup(function() {
                var last_name = jQuery(this).val();
                jQuery("#edit-submitted-civicrm-3-contact-1-contact-household-name").val('Family -' + last_name);
            });

        }
    };
}(jQuery));