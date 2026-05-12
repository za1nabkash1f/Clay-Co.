public class Workshop {

    private int    id;
    private String name;
    private String date;
    private int    duration;
    private int    availableSpots;
    private String description;
    private double price;
    private String level;
    private String image;

    public Workshop() {}

    public Workshop(int id, String name, String date, int duration,
                    int availableSpots, String description,
                    double price, String level, String image) {
        this.id             = id;
        this.name           = name;
        this.date           = date;
        this.duration       = duration;
        this.availableSpots = availableSpots;
        this.description    = description;
        this.price          = price;
        this.level          = level;
        this.image          = image;
    }

    // Getters
    public int    getId()             { return id; }
    public String getName()           { return name; }
    public String getDate()           { return date; }
    public int    getDuration()       { return duration; }
    public int    getAvailableSpots() { return availableSpots; }
    public String getDescription()    { return description; }
    public double getPrice()          { return price; }
    public String getLevel()          { return level; }
    public String getImage()          { return image; }

    // Setters
    public void setId(int id)                       { this.id             = id; }
    public void setName(String name)                { this.name           = name; }
    public void setDate(String date)                { this.date           = date; }
    public void setDuration(int duration)           { this.duration       = duration; }
    public void setAvailableSpots(int spots)        { this.availableSpots = spots; }
    public void setDescription(String description)  { this.description    = description; }
    public void setPrice(double price)              { this.price          = price; }
    public void setLevel(String level)              { this.level          = level; }
    public void setImage(String image)              { this.image          = image; }
}