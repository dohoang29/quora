$(function() {
    $('.lazy').Lazy();
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
  $(".voteArea")
    .children()
    .click(function() {
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

var allEditors = document.querySelectorAll(".ansEditor");
allEditors.forEach(editor => {
  ClassicEditor.create(editor);
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
function functionUp(){
  var x = document.getElementById("userResetAvatar");
  var y= document.getElementById("submitPicture");
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
    $("#submitPicture").click(function() {
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
  if (upload != null) {
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
            cropper = new Cropper(img, {
              aspectRatio: 1 / 1
            });
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    // save on click
    save.addEventListener("click", e => {
      e.preventDefault();
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
      $("#submitPicture").click(function() {
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
