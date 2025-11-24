import { Wine } from "../types/wine";

export const formatWineData = (data: any[]): Wine[] => {
    return data.map(item => ({
        id: item.id,
        Location: item.Location,
        Rating: item.Rating,
        Vintage: item.Vintage,
        Winery: item.Winery,
        Grape: item.Grape,
        Style: item.Style,
        Name: item.Name,
        Region: item.Region,
        Helper: item.Helper,
        Price: item.Price,
        Consumed: item.Consumed,
        Date_Consumed: item.Date_Consumed,
        Notes: item.Notes,
    }));
};

export const filterWinesByStyle = (wines: Wine[], style: string): Wine[] => {
    return wines.filter(wine => wine.Style.toLowerCase() === style.toLowerCase());
};

export const sortWinesByVintage = (wines: Wine[], ascending: boolean = true): Wine[] => {
    return wines.sort((a, b) => ascending ? a.Vintage.localeCompare(b.Vintage) : b.Vintage.localeCompare(a.Vintage));
};