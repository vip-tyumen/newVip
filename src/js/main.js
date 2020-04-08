(function($){
	function showModal(title, message, timeClose = 3000, timer = true){
		var close = (timeClose === false) ? false : true;
		console.log(close);
		var $message = `<div class="custom--content--fancybox"><h2 class="text-center custom--content--fancybox--title">` + title + `</h2>` + message + `</div>`;
		var $modal = $.fancybox.open({
			src: $message,
			type: 'inline',
			opts: {
				modal: close
			}
		});
		if(timer === true && typeof timeClose == "number"){
			setTimeout(function(){
				$modal.close();
			}, timeClose);
		}
		if(timeClose === false){

		}
	}
	$(document).on("click", ".linkesouter--list--item a", function(e){
		var $this = $(e.currentTarget),
			share = $this.data('url'),
			url = encodeURIComponent(share + window.location.search),
			title = encodeURIComponent($this.data('titl')),
			img = encodeURIComponent($("meta[itemprop=image]").attr('content')),
			desc = $this.data('desc') || $("head meta[name=description]").attr("content"),
			params = "status=no,toolbar=no,menubar=no",
			go = $this.data('go'),
			id = parseInt($this.attr('data-page-id')) || false,
			link;
		switch(go){
			case "fbs":
				e.preventDefault();
				link = "http://www.facebook.com/sharer.php?s=100&p[url]="+url+"&p[images][0]="+img+"&p[title]="+title+"&p[summary]="+encodeURIComponent(desc);
				break;
			case "tws":
				e.preventDefault();
				desc = desc.replace(/\s+/gm, " ").slice(0, 280);
				link = "https://twitter.com/intent/tweet?url="+url+"&text="+encodeURIComponent(desc);
				break;
			case "vks":
				e.preventDefault();
				link = "https://vk.com/share.php?url="+url+"&title="+title+"&image="+img+"&description="+encodeURIComponent(desc);
				break;
			case "oks":
				e.preventDefault();
				link = "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl="+url;
				break;
		}
		$this.data('desc', desc);
		link && window.open(link,"projectsoft",params);
		return !1;
	});
}(jQuery));
