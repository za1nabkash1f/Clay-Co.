public class Event {

    private int    id;
    private String name;
    private int    dayOfMonth;
    private String description;

    public Event() {}

    public Event(int id, String name, int dayOfMonth, String description) {
        this.id          = id;
        this.name        = name;
        this.dayOfMonth  = dayOfMonth;
        this.description = description;
    }

    // Getters
    public int    getId()          { return id; }
    public String getName()        { return name; }
    public int    getDayOfMonth()  { return dayOfMonth; }
    public String getDescription() { return description; }

    // Setters
    public void setId(int id)                      { this.id          = id; }
    public void setName(String name)               { this.name        = name; }
    public void setDayOfMonth(int dayOfMonth)      { this.dayOfMonth  = dayOfMonth; }
    public void setDescription(String description) { this.description = description; }
}