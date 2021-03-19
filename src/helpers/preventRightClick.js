export function preventRightClick(element) {

	function contextMenu(event) {
        event.preventDefault();
	}
	
	element.addEventListener('contextmenu', contextMenu);
	
	return {
		destroy() {
			element.removeEventListener('contextmenu', contextMenu);
		}
	}
}