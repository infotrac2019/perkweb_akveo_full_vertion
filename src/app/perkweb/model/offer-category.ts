
export class OfferCategory {
    
    id?: string;
    name?: string;
    description?: string;
    subCategory?: OfferCategory[];
    category: OfferCategory;
    isChecked: boolean;
    
}
