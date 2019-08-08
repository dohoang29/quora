$(function() {
  $.getDocHeight = function() {
    return Math.max(
      $(document).height(),
      $(window).height(),
      /* For opera: */
      document.documentElement.clientHeight
    );
  };
  $(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() == $.getDocHeight()) {
      var endValue = $("#showQuestion").attr("value");
      var currentUser = $("#showQuestion").attr("userId");
      var html = "";
      $("#feedLoading").show();
      if (endValue != undefined) {
        $.ajax({
          type: "GET",
          url: window.location.origin + "/feed/" + endValue,
          async: false,
          success: function(data) {
            if (data != null) {
              if (data.questions != null) {
                data.questions.forEach(question => {
                  html = "";
                  if (question.isActive == true) {
                    var flag = (flagFollow = false);
                    html +=
                      "<div class='card-body question-card'><div class='card-subtitle text-muted'><p class='question-topic'>";
                    question.topic.forEach(topic => {
                      html +=
                        "Question added ·" +
                        "<a class='number-answer-link' href='/topic/" +
                        topic._id +
                        "'>" +
                        topic.title +
                        "</a>";
                    });
                    html +=
                      "</p>" +
                      "</div>" +
                      "<a href='/question/" +
                      question._id +
                      "'>" +
                      "<h3 class='question-title mt-1'>" +
                      "<strong>" +
                      question.title +
                      "</strong>" +
                      "</h3>" +
                      "</a>" +
                      "<div class='question-more-info'>" +
                      "<p>" +
                      "<strong>" +
                      "<a class='number-answer-link' href='/question/" +
                      question._id +
                      "'>";
                    if (question.answers == null) {
                      html += "0 Answers ";
                    } else {
                      html += question.answers.length.toString() + " Answers ";
                    }
                    html +=
                      "</a>" +
                      "</strong>" +
                      "· Created " +
                      moment(question.dateCreated).fromNow() +
                      "</p>" +
                      "</div>" +
                      "<div class='upvote-follow'>" +
                      "Upvote · " +
                      "<span id='votenumber" +
                      question._id +
                      "' class='mr-3'>";
                    if (question.upVoted == null) {
                      html += "0";
                    } else {
                      html += question.upVoted.length.toString();
                      question.upVoted.forEach(vote => {
                        if (currentUser == vote) {
                          flag = true;
                        }
                      });
                    }
                    html +=
                      "</span>" +
                      "Follow · " +
                      "<span id='follownumber" +
                      question._id +
                      "' class='mr-3'>";

                    if (question.followers == null) {
                      html += "0";
                    } else {
                      html += question.followers.length.toString();
                      question.followers.forEach(follower => {
                        if (currentUser == follower) {
                          flagFollow = true;
                        }
                      });
                    }
                    html +=
                      "</span>" +
                      "</div>" +
                      "<div class='answer-btn-wrapper'>" +
                      "<div class='clearfix mt-1'>" +
                      "<button " +
                      "data-toggle='collapse' " +
                      "href='#collapse" +
                      question._id +
                      "' " +
                      "role='button'" +
                      "aria-expanded='false'" +
                      "aria-controls='collapse" +
                      question._id +
                      "'" +
                      "class='answer-button mr-2 btn-link btn showAnswer'" +
                      "id='showAnswercollapse"+question._id+"'"
                      ">" +
                      "<span class='fa fa-edit answer-icon'></span>" +
                      "<strong> Answer</strong>" +
                      "</button>" +
                      " <span id='" +
                      currentUser +
                      "' class='voteArea'>" +
                      "<button " +
                      "id='" +
                      question._id +
                      "' " +
                      "value=";
                    if (flag == false) {
                      html += "'Upvote'";
                    } else {
                      html += "'Downvote'";
                    }
                    html +=
                      " class='answer-button mr-2 btn-link btn actionbtn likebtn'>" +
                      "<span " +
                      "class=";
                    if (flag == false) {
                      html += "'fas fa-thumbs-up answer-icon'";
                    } else {
                      html += "'fas fa-thumbs-down'";
                    }
                    html += " ></span><strong>";
                    if (flag == false) {
                      html += " Upvote";
                    } else {
                      html += " Downvote";
                    }
                    html +=
                      "</strong>" +
                      " </button>" +
                      " <button " +
                      "id ='follow" +
                      question._id +
                      "' " +
                      "class='answer-button mr-2 btn-link btn actionbtn' " +
                      "value=";
                    if (flagFollow == false) {
                      html += "'Follow'";
                    } else {
                      html += "'Unfollow'";
                    }
                    html += "><span class=";
                    if (flagFollow == false) {
                      html += "'fa fa-plus-circle answer-icon'";
                    } else {
                      html += "'fas fa-times-circle'";
                    }
                    html += "></span><strong>";
                    if (flagFollow == false) {
                      html += " Follow";
                    } else {
                      html += " Unfollow";
                    }
                    html +=
                      "</strong>" +
                      "</button>" +
                      "</span>" +
                      "<a " +
                      "class='question-more-options'" +
                      "href='#'" +
                      "role='button'" +
                      "id='dropdownMenuOptions" +
                      question._id +
                      "'" +
                      "data-toggle='dropdown'" +
                      "aria-haspopup='true'" +
                      "aria-expanded='false'" +
                      "><i class='fas fa-ellipsis-h'></i>" +
                      "</a>" +
                      "<div " +
                      "class='dropdown-menu'" +
                      "aria-labelledby='dropdownMenuOptions" +
                      question._id +
                      "'" +
                      ">";
                    if (currentUser == question.author) {
                      html +=
                        "<a " +
                        " class='dropdown-item'" +
                        "data-toggle='modal'" +
                        "data-target='#editQuestion'" +
                        " >Edit</a" +
                        ">" +
                        "<form " +
                        "action='/question/'" +
                        question._id +
                        "?_method=DELETE'" +
                        "method='post'" +
                        ">" +
                        "<button class='dropdown-item' type='submit'>Delete</button>" +
                        "</form>";
                    }
                    html +=
                      "<a class='dropdown-item' href='#'>Report</a>" +
                      "</div>" +
                      "</div>" +
                      "</div>" +
                      "<div class='collapse' id='collapse" +
                      question._id +
                      "'>" +
                      "<div class='card w-100 mt-2'>" +
                      "<div class='card-header'>" +
                      " <img " +
                      "src='/images/IMG_20150427_214234.jpg'" +
                      " alt='avatar'" +
                      "class='add-ans-image'" +
                      " />" +
                      "<div class='user-info'>" +
                      "<a class='user-name-link' href='/profile/" +
                      currentUser +
                      "'" +
                      " >" +
                      $("#userFullName").text() +
                      "</a" +
                      " >, knows";
                    question.topic.forEach(topic => {
                      html +=
                        "<a class='ans-topic-link' href='/topic/" +
                        topic._id +
                        "'>" +
                        topic.title +
                        "</a>";
                    });
                    html +=
                      "</div>" +
                      "</div>" +
                      "<form " +
                      "class='ansForm'" +
                      "method='POST'" +
                      "action='/answer/";
                    question.topic.forEach(topic => {
                      html += topic._id + "/";
                    });
                    html +=
                      question._id +
                      "/" +
                      currentUser +
                      "'>" +
                      "<div class='add-ans-card'>" +
                      "<textarea " +
                      " name='content'" +
                      "class='ansEditor'" +
                      "id='ansEditorcollapse" +
                      question._id +
                      "'" +
                      "placeholder='Write your answer'" +
                      "></textarea>" +
                      "</div>" +
                      "<div class='card-footer text-muted'>" +
                      "<button type='submit' class='btn btn-primary add-question-button'>" +
                      "Add Answer" +
                      "</button>" +
                      "<button " +
                      " type='button'" +
                      "class='btn btn-secondary cancel-button'" +
                      "id='cancelcollapse" +
                      question._id +
                      "'";
                    "data-toggle='collapse'" +
                      " href='#collapse" +
                      question._id +
                      "'" +
                      " role='button'" +
                      " aria-expanded='false'" +
                      "aria-controls='collapse" +
                      question._id +
                      "'" +
                      ">" +
                      "Cancel" +
                      "</button>" +
                      " </div>" +
                      "</form>" +
                      "</div>" +
                      " </div>" +
                      " </div>";
                  }
                  $("#showQuestion").attr("value", question.dateCreated);
                  $("#showQuestion").append(html);
                  $("#feedLoading").hide();
                });
              }
            }
            $("#feedLoading").hide();
          }
        });
      }
    }
  });
});
$(function() {
  $(".topicFollowArea")
    .children()
    .click(function() {
      var userId = $(this).attr("userId");
      var action = $(this).attr("value");
      var topicId = $(this)
        .parent()
        .attr("id");
      $.ajax({
        type: "GET",
        url:
          window.location.origin +
          "/topic/" +
          topicId +
          "/" +
          userId +
          "/" +
          action,
        async: false,
        success: function(follow) {
          if (follow.status === "Unfollow") {
            $("#topicIcon" + topicId)
              .removeClass("fa fa-plus-circle answer-icon")
              .addClass("fas fa-times-circle");
            $("#topicLabel" + topicId).text(follow.status);
            $("#topicFollowNumber" + topicId).text(follow.count);
            $("#topicFollowArea" + topicId).attr("value", follow.status);
          }
          if (follow.status === "Follow") {
            $("#topicIcon" + topicId)
              .removeClass("fas fa-times-circle")
              .addClass("fa fa-plus-circle answer-icon");
            $("#topicLabel" + topicId).text(follow.status);
            $("#topicFollowNumber" + topicId).text(follow.count);
            $("#topicFollowArea" + topicId).attr("value", follow.status);
          }
        }
      });
    });
});

$(function() {
  $("#showQuestion").on("click", ".actionbtn", function() {
    var questionId = $(this)
      .parent()
      .children()
      .filter(".likebtn")
      .attr("id");
    var userId = $(this)
      .parent()
      .attr("id");
    var action = $(this).attr("value");
    var numberUpvote = "votenumber" + questionId;
    var follownumber = "follownumber" + questionId;
    $.ajax({
      type: "GET",
      url: window.location + "/" + questionId + "/" + userId + "/" + action,
      async: false,
      success: function(vote) {
        console.log(vote.status);
        if (vote.status === "Downvote") {
          $("#" + questionId + " > span")
            .removeClass("fas fa-thumbs-up answer-icon")
            .addClass("fas fa-thumbs-down");
          $("#" + questionId + " > strong").text(vote.status);
          $("#" + numberUpvote).text(vote.voteCount);
          $("#" + questionId).attr("value", vote.status);
        }
        if (vote.status === "Upvote") {
          $("#" + questionId + " > span")
            .removeClass("fas fa-thumbs-down")
            .addClass("fas fa-thumbs-up answer-icon");
          $("#" + questionId + " > strong").text(vote.status);
          $("#" + numberUpvote).text(vote.voteCount);
          $("#" + questionId).attr("value", vote.status);
        }
        if (vote.status === "Unfollow") {
          $("#follow" + questionId + " > span")
            .removeClass("fa fa-plus-circle answer-icon")
            .addClass("fas fa-times-circle");
          $("#follow" + questionId + " > strong").text(vote.status);
          $("#" + follownumber).text(vote.voteCount);
          $("#follow" + questionId).attr("value", vote.status);
        }
        if (vote.status === "Follow") {
          $("#follow" + questionId + " > span")
            .removeClass("fas fa-times-circle")
            .addClass("fa fa-plus-circle answer-icon");
          $("#follow" + questionId + " > strong").text(vote.status);
          $("#" + follownumber).text(vote.voteCount);
          $("#follow" + questionId).attr("value", vote.status);
        }
      }
    });
  });
});
$(function() {
  $(".topic-link")
    .filter(function() {
      return this.href == location.href;
    })
    .parent()
    .addClass("link-active")
    .siblings()
    .removeClass("link-active");
  $(".topic-link").click(function() {
    $(this)
      .parent()
      .addClass("link-active")
      .siblings()
      .removeClass("link-active");
  });
});
$(function() {
  $(".nav-link")
    .filter(function() {
      return this.href == location.href;
    })
    .addClass("nav-active")
    .parent()
    .siblings()
    .children()
    .removeClass("nav-active");
  $(".nav-link").click(function() {
    $(this)
      .addClass("nav-active")
      .parent()
      .siblings()
      .children()
      .removeClass("nav-active");
  });
});
$(function() {
  $("#showQuestion").on("click", ".showAnswer", function() {
    var quesId = $(this).attr("aria-controls");
    var editor = "ansEditor" + quesId;
    // $(".add-ans-card").empty();
    // $(".add-ans-card").append("<textarea class='ansEditor' id='"+editor+"' name='content' placeholder='Write your answer...'></textarea>");
    
        $(this).removeClass("showAnswer");
    
    ClassicEditor.create(document.querySelector("#" + editor)).then(
        
    )
  });
  $("#showQuestion").on("click", ".cancel-button", function() {
    var editor = "ansEditor" + $(this).attr("aria-controls");
    var showAnswer = "showAnswer"+$(this).attr("aria-controls");
    $("#"+showAnswer).addClass("showAnswer");
    $(this).parent().parent().children().filter(".add-ans-card").empty();
    $(this).parent().parent().children().filter(".add-ans-card").append(
      "<textarea class='ansEditor' id='" +
        editor +
        "' name='content' placeholder='Write your answer...'></textarea>"
    )
  });
});

function backToProfile() {
  var x = document.getElementById("userProfile");
  var y = document.getElementById("userResetpassword");
  x.style.display = "block";
  y.style.display = "none";
}

function myFunctionReset() {
  var x = document.getElementById("userProfile");
  var y = document.getElementById("userResetpassword");
  if (y.style.display === "block") {
    y.style.display = "none";
    x.style.display = "none";
  } else {
    y.style.display = "block";
    x.style.display = "none";
  }
}
//
function functionUp() {
  var x = document.getElementById("userResetAvatar");
  var y = document.getElementById("submitPicture");
  var z = document.getElementById("upPicture");
  x.style.display = "inline";
  y.style.display = "none";
  z.style.display = "inline";
}
function myFunctionCrop() {
  var z = document.getElementById("userResetAvatar");
  var t = document.getElementById("userCropAvatar");
  z.style.display = "none";
  t.style.display = "inline-block";
}
function myFunctionUp() {
  var z = document.getElementById("submitPicture");
  var t = document.getElementById("loadingAvatar");
  z.style.display = "none";
  t.style.display = "inline-block";
}

// vars
let result = document.querySelector(".result"),
  img_result = document.querySelector(".img-result"),
  img_w = document.querySelector(".img-w"),
  img_h = document.querySelector(".img-h"),
  options = document.querySelector(".options"),
  save = document.querySelector(".save"),
  cropped = document.querySelector(".cropped"),
  upload = document.querySelector("#file-input"),
  up = document.querySelector(".up"),
  cropper = "";
// on change show image with crop options
if (upload) {
  upload.addEventListener("change", e => {
    if (e.target.files.length) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target.result) {
          let img = document.createElement("img");
          img.id = "image";
          img.src = e.target.result;
          result.innerHTML = "";
          // append new image
          result.appendChild(img);
          save.classList.remove("hide");
          options.classList.remove("hide");
          cropper = new Cropper(img);
          console.log(img);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
}
// save on click
if (save) {
  console.log("test");
  save.addEventListener("click", e => {
    e.preventDefault();
    console.log("test2");
    // get result to data uri
    let imgSrc = cropper
      .getCroppedCanvas({
        width: img_w.value // input value
      })
      .toDataURL();
    // remove hide class of img
    cropped.classList.remove("hide");
    img_result.classList.remove("hide");
    // show image cropped
    cropped.src = imgSrc;
    up.setAttribute("href", imgSrc);
  });
    //post form
    $(function() {
      $(".upPicture").click(function() {
        var avatar = {
          imgSrc: $("#imageCropped").attr("src")
        };
        var idUser = $("#imageCropped").attr("value");
        $.ajax({
          type: "post",
          async: false,
          data: avatar,
          url: window.location.origin + "/upload/" + idUser,
          success: function() {
            location.reload();
          }
          // complete: function(notifi) {
          //     $('.notifiAvatar').append("<span>You are reset avatar success!</span>");
          // }
        });
      });
    });
}
$(function() {
  $(".carousel").slick({
    infinite: false,
    speed: 300,
    centerMode: false,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    variableWidth: true,
    arrows: false
  });
});
$(function() {
  $("#sideBarButton").click(function() {
    var value = $(this).attr("value");
    if (value === "close") {
      $("#sideBarArea").animate({
        left: "0px"
      });
      $("#sideBarButton").attr("value", "open");
    } else {
      $("#sideBarArea").animate({
        left: "-400px"
      });
      $("#sideBarButton").attr("value", "close");
    }
  });
  $("#sideBarCloseBtn").click(function() {
    $("#sideBarArea").animate({
      left: "-400px"
    });
  });
});
$(".modal").on("shown.bs.modal", function() {
  $(this)
    .find("[autofocus]")
    .focus();
});
$(".search-box").focus(function() {
  $(".dim").css("display", "block");
  $(".dim").animate({ opacity: "0.7" });
  $(this).keyup(function search() {
    $(".searchResult").empty();
    $(".searchResult").append("<div class='loading search-result-item'></div>");
    $(".searchResult").show();
    if ($(this).val() != "") {
      var value = $(this).val();
      $.ajax({
        type: "GET",
        url: window.location.origin + "/search/" + value,
        success: function(results) {
          if (results != "") {
            $(".searchResult").empty();
            results.forEach(result => {
              if (result.user != null) {
                $(".searchResult").append(
                  "<a href='/profile/" +
                    result.user +
                    "' class='search-result-item'><div class='border-bottom p-2 text-dark '><span class='text-muted'>User: </span>" +
                    result.name +
                    " <i class='fas fa-chevron-right text-muted search-arrow'></i></div></a>"
                );
              }
              if (result.question != null) {
                $(".searchResult").append(
                  "<a href='/question/" +
                    result.question +
                    "' class='search-result-item'><div class='border-bottom p-2 text-dark '><span class='text-muted'>Question: </span>" +
                    result.name +
                    " <i class='fas fa-chevron-right text-muted search-arrow'></i></div></a>"
                );
              }
              if (result.topic != null) {
                $(".searchResult").append(
                  "<a href='/topic/" +
                    result.topic +
                    "' class='search-result-item'><div class='border-bottom p-2 text-dark '><span class='text-muted'>Topic: </span>" +
                    result.name +
                    " <i class='fas fa-chevron-right text-muted search-arrow'></i></div></a>"
                );
              }
            });
          } else {
            $(".searchResult").empty();
            $(".searchResult").append(
              "<div class='border-bottom p-2  alert-danger  '> We can't find it! Please try another word</div>"
            );
          }
        }
      });
    } else {
      $(".searchResult").hide();
    }
  });
});
$(".search-box").blur(function() {
  $(".searchResult")
    .delay("fast")
    .fadeOut();
  $(".dim").animate({ opacity: "0" });
  $(".dim").css("display", "none");
  setTimeout(function() {
    $(".searchResult").empty();
  }, 1000);
});
$("#startSearch").click(function() {
  $("#searchBar").animate({
    left: "0px"
  });
  $("#mobileSearchBox").animate({
    left: "0px"
  });
});
$("#searchBackBtn").click(function() {
  $("#searchBar").animate({
    left: "-1024px"
  });
  $("#mobileSearchBox").animate({
    left: "-1024px"
  });
});

$(function() {
  $(".submitNoti").click(function() {
    var userId = $(this).attr("value");
    $(".noti-user").empty();
    $(".noti-user").append("<div class='loading search-result-item'></div>");
    $.ajax({
      type: "GET",
      url: window.location.origin + "/noti/" + userId,
      success: function(noti) {
        $.ajax({
          type: "POST",
          data: { data: noti },
          url: window.location.origin + "/noti",
          success: function(results) {
            if (results != "") {
              $(".noti-user").empty();
              results.forEach(result => {
                $(".noti-user").append(
                  "<a class='dropdown-item noti-content border-bottom' href='/question/" +
                    result.questionId._id +
                    "'><img class='imageMember' src='" +
                    result.author.imageUrl +
                    "'><strong>" +
                    result.author.firstname +
                    "</strong> has added a new answer in <strong>" +
                    result.title +
                    "</strong><p class='m-0'>" +
                    moment(result.creationDate).fromNow() +
                    "</p></a>"
                );
              });
            } else {
              $(".noti-user").empty();
              $(".noti-user").append(
                "<li class='urlNoti'><div class='border-bottom p-2  alert-success  '> You don't have any Notification </div></li>"
              );
            }
          }
        });
      }
    });
  });
});
