export function addEventListener(
	el: HTMLElement,
	eventName: string,
	eventHandler: (this: HTMLElement, event: Event) => void,
	selector: string,
) {
	if (selector) {
		const wrappedHandler = (event: Event) => {
			if (!event.target) return;
			const el = (event.target as HTMLElement).closest(selector) as HTMLElement;
			if (el) {
				eventHandler.call(el, event);
			}
		};
		el.addEventListener(eventName, wrappedHandler);
		return wrappedHandler;
	}

	const wrappedHandler = (event: Event) => {
		eventHandler.call(el, event);
	};
	el.addEventListener(eventName, wrappedHandler);
	return wrappedHandler;
}
