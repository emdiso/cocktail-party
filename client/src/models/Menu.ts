import MenuItem from './MenuItem';


export default interface Menu {
    id: number;
	user_id: number;
	image_id?: number;
	title: number;
    item_count: number;
    menu_items?: MenuItem[];
}