import MenuItem from './MenuItem';


export default interface Menu {
    id: number;
	user_id: number;
	image_id: number;
	title: number;
    date_created?: string;
    item_count: number;
    menu_items?: MenuItem[];
}