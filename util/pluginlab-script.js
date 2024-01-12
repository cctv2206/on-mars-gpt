console.log('script is running');

var changeStyles = function () {
  var bg = window.document.querySelector(".bg-gray-50");
  if (bg) bg.style.background = "#000000";

  var modal = bg.querySelector(".bg-white.shadow");
  if (modal) modal.style.background = "#111111";

  var logo = modal.querySelector(".text-gray-700");
  if (logo) logo.remove();

  var header = modal.querySelector(".text-center.text-gray-800");
  if (header) header.style.color = "#ffffff";

  var txt = modal.querySelector("span.text-gray-800.text-center");
  if (txt) txt.style.color = "rgba(255, 255, 255, 0.7)";

  var btn = modal.querySelector('button');
  if (btn) {
    btn.style.fontWeight = '700';
  }
}

var observer = new MutationObserver(function (_mutations) {
  console.log('handle mutation...');
  changeStyles();
});
var config = { attributes: true, childList: true, subtree: true };
var targetNode = window.document.querySelector(".bg-gray-50");
observer.observe(targetNode, config);

changeStyles();