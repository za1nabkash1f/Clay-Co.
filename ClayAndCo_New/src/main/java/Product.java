public class Product implements Orderable {

    private int    id;
    private String name;
    private String category;
    private double price;
    private double rating;
    private int    reviews;
    private int    stock;
    private String image;
    private String description;

    public Product() {}

    public Product(int id, String name, String category, double price,
                   double rating, int reviews, int stock,
                   String image, String description) {
        this.id          = id;
        this.name        = name;
        this.category    = category;
        this.price       = price;
        this.rating      = rating;
        this.reviews     = reviews;
        this.stock       = stock;
        this.image       = image;
        this.description = description;
    }

    // Getters
    public int    getId()          { return id; }
    public String getName()        { return name; }
    public String getCategory()    { return category; }
    public double getPrice()       { return price; }
    public double getRating()      { return rating; }
    public int    getReviews()     { return reviews; }
    public int    getStock()       { return stock; }
    public String getImage()       { return image; }
    public String getDescription() { return description; }

    // Setters
    public void setId(int id)                      { this.id          = id; }
    public void setName(String name)               { this.name        = name; }
    public void setCategory(String category)       { this.category    = category; }
    public void setPrice(double price)             { this.price       = price; }
    public void setRating(double rating)           { this.rating      = rating; }
    public void setReviews(int reviews)            { this.reviews     = reviews; }
    public void setStock(int stock)                { this.stock       = stock; }
    public void setImage(String image)             { this.image       = image; }
    public void setDescription(String description) { this.description = description; }
    
   
    @Override
    public String getOrderSummary() {
        return "Product: " + name + " | $" + price;
    
    }
}
