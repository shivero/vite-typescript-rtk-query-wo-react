import { setupCounter } from "./counter.ts";
import "./list.css";
import { GetItemData, actions } from "./store/counterReducer.ts";
import { $ListStore } from "./store/counterStore.ts";
import "./style.css";
import { addEventListener } from "./utils.ts";

const appDom = document.querySelector<HTMLDivElement>("#app");
if (!appDom) {
	throw new Error("Not #app container found");
}
appDom.innerHTML = `
  <div class="container">
    <h1>Vite + TypeScript + Redux Toolkit</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <button id="addList" type="button">Add List</button>
    <div class="user-lists" id="favLists">
    </div>
  </div>
`;
// initialize list - fetch data from api
$ListStore.dispatch(actions.fetchLists());

function MakeAction() {
	GetItemData().then((data) => {
		$ListStore.dispatch(
			actions.addNewList({
				name: data.title,
				items: [
					{
						name: data.title,
						description: data.description,
						price: data.price,
						image: data.thumbnail,
					},
				],
				id: "",
			}),
		);
	});
}

const addListBtn = document.querySelector<HTMLButtonElement>("#addList");
addListBtn?.addEventListener("click", () => {
	MakeAction();
});

$ListStore.subscribe(() => {
	updateList();
});

const updateList = () => {
	const listDom = document.querySelector<HTMLDivElement>("#favLists");
	if (!listDom) return;
	if ($ListStore.getState().favLists.isLoading) {
		listDom.innerHTML = `
    <div class="loader">Loading...</div>
    `;
		return;
	}
	listDom.innerHTML = `
  ${$ListStore
		.getState()
		.favLists.UserFavorites.map((list) => {
			return `
      <div class="list">
        <div class="header">
          <h3>${list.name}</h3>
          <div>${list.items.length} produktów</div>
        </div>
        <div class="items">
          ${list.items.map((item) => {
						return `
              <div class="item">
                <p class="price">${item.price}</p>
                <div class="image-container"><img src="${item.image}" alt="${item.name}" /></div>
                <button id='removeListBtn' data-id=${list.id}>Remove</button>
              </div>
            `;
					})}
        </div>
      </div>
    `;
		})
		.join("")}
`;
};
addEventListener(
	document.body,
	"click",
	(event) => {
		const target = event.target as HTMLElement;
		$ListStore.dispatch(actions.removeList(target.dataset.id ?? ""));
	},
	"#removeListBtn",
);

const counterBtn = document.querySelector<HTMLButtonElement>("#counter");
if (!counterBtn) throw new Error("Not #counter button found");
setupCounter(counterBtn);
