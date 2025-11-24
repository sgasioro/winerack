import React, { Component } from 'react';
import WineCard from './WineCard';
import SearchBar from './SearchBar';
import { fetchWines } from '../services/googleSheetsApi';
import { Wine } from '../types/wine';

interface State {
    wines: Wine[];
    searchTerm: string;
    selectedRatings: string[];
}

class WineRack extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            wines: [],
            searchTerm: '',
            selectedRatings: []
        };
    }

    componentDidMount() {
        this.loadWines();
    }

    loadWines = async () => {
        const wines = await fetchWines();
        this.setState({ wines });
    };

    handleSearch = (term: string, selectedRatings: string[]) => {
        this.setState({ searchTerm: term, selectedRatings });
    };

    // Parse grid location (e.g., "A5" -> {column: "A", row: 5})
    parseGridLocation = (location: string) => {
        const match = location.match(/^([A-Z]+)(\d+)$/);
        if (match) {
            return {
                column: match[1],
                row: parseInt(match[2]),
                isGrid: true
            };
        }
        return {
            column: '',
            row: 0,
            isGrid: false,
            alternate: location
        };
    };

    // Group wines by their locations
    organizeWinesByLocation = (wines: Wine[]) => {
        const gridWines: { [key: string]: Wine | null } = {};
        const floorWines: Wine[] = [];
        const shoeRackTop: Wine[] = [];
        const shoeRackMiddle: Wine[] = [];
        const shoeRackBottom: Wine[] = [];
        const kitchenWines: Wine[] = [];
        const consumedWines: Wine[] = [];
        const otherWines: Wine[] = [];
        
        wines.forEach(wine => {
            const location = this.parseGridLocation(wine.Location);
            if (location.isGrid) {
                gridWines[wine.Location] = wine;
            } else {
                const locationLower = wine.Location.toLowerCase();
                if (locationLower.includes('floor')) {
                    floorWines.push(wine);
                } else if (locationLower.includes('shoe') && locationLower.includes('top')) {
                    shoeRackTop.push(wine);
                } else if (locationLower.includes('shoe') && locationLower.includes('middle')) {
                    shoeRackMiddle.push(wine);
                } else if (locationLower.includes('shoe') && locationLower.includes('bottom')) {
                    shoeRackBottom.push(wine);
                } else if (locationLower.includes('kitchen')) {
                    kitchenWines.push(wine);
                } else if (locationLower.includes('consumed')) {
                    consumedWines.push(wine);
                } else {
                    otherWines.push(wine);
                }
            }
        });

        return { 
            gridWines, 
            floorWines, 
            shoeRackTop, 
            shoeRackMiddle, 
            shoeRackBottom, 
            kitchenWines, 
            consumedWines, 
            otherWines 
        };
    };

    // Generate grid positions transposed - rows as letters, columns as numbers
    generateGridPositions = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        const columns = Array.from({ length: 10 }, (_, i) => i + 1);
        
        return rows.map(row => ({
            row,
            positions: columns.map(col => `${row}${col}`)
        }));
    };

    // Get wine style color class
    getWineStyleClass = (style: string) => {
        if (!style) return '';
        
        const styleLower = style.toLowerCase();
        if (styleLower.includes('sparkling')) return 'wine-style-sparkling';
        if (styleLower.includes('white')) return 'wine-style-white';
        if (styleLower.includes('rose') || styleLower.includes('rosé')) return 'wine-style-rose';
        if (styleLower.includes('orange')) return 'wine-style-orange';
        if (styleLower.includes('red')) return 'wine-style-red';
        if (styleLower.includes('dessert') || styleLower.includes('sweet')) return 'wine-style-dessert';
        if (styleLower.includes('non-alcoholic') || styleLower.includes('alcohol-free')) return 'wine-style-non-alcoholic';
        
        return ''; // Default no color
    };

    render() {
        const { wines, searchTerm, selectedRatings } = this.state;
        
        // Get all matching wines for highlighting
        const matchingWines = new Set();
        if (searchTerm || selectedRatings.length > 0) {
            wines.forEach(wine => {
                const textMatch = searchTerm === '' || (
                    wine.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wine.Winery?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wine.Location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wine.Style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wine.Vintage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wine.Region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    wine.Grape?.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const ratingMatch = selectedRatings.length === 0 || 
                    selectedRatings.includes(wine.Rating);

                if (textMatch && ratingMatch) {
                    matchingWines.add(wine.id);
                }
            });
        }

        const isSearchActive = searchTerm || selectedRatings.length > 0;

        // Use all wines for display (not filtered)
        const { 
            gridWines, 
            floorWines, 
            shoeRackTop, 
            shoeRackMiddle, 
            shoeRackBottom, 
            kitchenWines, 
            consumedWines, 
            otherWines 
        } = this.organizeWinesByLocation(wines);
        const gridLayout = this.generateGridPositions();

        const renderAlternateSection = (wines: Wine[], title: string) => {
            if (wines.length === 0) return null;
            
            // Filter wines for search if active
            const visibleWines = isSearchActive 
                ? wines.filter(wine => matchingWines.has(wine.id))
                : wines;
            
            if (isSearchActive && visibleWines.length === 0) return null;
            
            // Group wines into rows of 10
            const rows = [];
            for (let i = 0; i < visibleWines.length; i += 10) {
                rows.push(visibleWines.slice(i, i + 10));
            }
            
            return (
                <div className="alternate-section">
                    <h3>{title}</h3>
                    <div className="alternate-wine-grid">
                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} className="alternate-row">
                                {row.map((wine, colIndex) => {
                                    const styleClass = this.getWineStyleClass(wine.Style);
                                    const cellClasses = [
                                        'grid-cell',
                                        styleClass
                                    ].filter(Boolean).join(' ');
                                    
                                    return (
                                        <div 
                                            key={wine.id} 
                                            className={cellClasses}
                                        >
                                            <WineCard wine={wine} />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="wine-rack-container">
                <SearchBar onSearch={this.handleSearch} />
                
                {/* Show search results summary if searching */}
                {isSearchActive && (
                    <div className="search-summary">
                        Found {matchingWines.size} wine{matchingWines.size !== 1 ? 's ' : ' '} 
                        {searchTerm && `matching "${searchTerm}"`}
                        {searchTerm && selectedRatings.length > 0 && ' and '}
                        {selectedRatings.length > 0 && `with rating(s): ${selectedRatings.join(', ')}`}
                    </div>
                )}
                
                {/* Main Grid Display */}
                <div className="wine-grid">
                    <h2>Main Wine Rack</h2>
                    {/* Column Headers */}
                    <div className="grid-header">
                        <div className="row-label-header"></div>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(col => (
                            <div key={col} className="column-header">{col}</div>
                        ))}
                    </div>
                    
                    {/* Grid Rows */}
                    {gridLayout.map(rowData => (
                        <div key={rowData.row} className="grid-row">
                            <div className="row-label">{rowData.row}</div>
                            {rowData.positions.map(position => {
                                const wine = gridWines[position];
                                const isMatch = wine && (!isSearchActive || matchingWines.has(wine.id));
                                const styleClass = wine ? this.getWineStyleClass(wine.Style) : '';
                                
                                return (
                                    <div 
                                        key={position} 
                                        className={`grid-cell ${styleClass} ${!isMatch && wine ? 'hidden-wine' : ''}`}
                                    >
                                        {wine && isMatch ? (
                                            <WineCard wine={wine} />
                                        ) : wine && !isMatch ? (
                                            <div className="hidden-slot">{position}</div>
                                        ) : (
                                            <div className="empty-slot">{position}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Alternate Location Sections */}
                <div className="alternate-locations">
                    {renderAlternateSection(floorWines, "Floor")}
                    
                    {(shoeRackTop.length > 0 || shoeRackMiddle.length > 0 || shoeRackBottom.length > 0) && (
                        <div className="shoe-rack-section">
                            <h2>Shoe Rack</h2>
                            {renderAlternateSection(shoeRackTop, "Top Shelf")}
                            {renderAlternateSection(shoeRackMiddle, "Middle Shelf")}
                            {renderAlternateSection(shoeRackBottom, "Bottom Shelf")}
                        </div>
                    )}
                    
                    {renderAlternateSection(kitchenWines, "Kitchen")}
                    {renderAlternateSection(consumedWines, "Consumed")}
                    {renderAlternateSection(otherWines, "Other Locations")}
                </div>
            </div>
        );
    }
}

export default WineRack;