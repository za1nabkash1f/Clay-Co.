public class CustomOrder extends Product {

    private String customerName;
    private String customerEmail;
    private int    quantity;
    private String color;
    private String budget;
    private String notes;

    public CustomOrder() {
        super();
    }

    public CustomOrder(int id, String customerName, String customerEmail,
                       String productType, int quantity,
                       String color, String budget, String notes) {
        // Inherits from Product — type maps to name, category = "Custom"
        super(id, productType, "Custom", 0.0, 0.0, 0, quantity, "", notes);
        this.customerName  = customerName;
        this.customerEmail = customerEmail;
        this.quantity      = quantity;
        this.color         = color;
        this.budget        = budget;
        this.notes         = notes;
    }

    // Getters
    public String getCustomerName()  { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public int    getQuantity()      { return quantity; }
    public String getColor()         { return color; }
    public String getBudget()        { return budget; }
    public String getNotes()         { return notes; }
    public String getProductType()   { return getName(); } // inherited from Product

    // Setters
    public void setCustomerName(String customerName)   { this.customerName  = customerName; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public void setQuantity(int quantity)              { this.quantity      = quantity; }
    public void setColor(String color)                 { this.color         = color; }
    public void setBudget(String budget)               { this.budget        = budget; }
    public void setNotes(String notes)                 { this.notes         = notes; }

    // Polymorphic override — custom orders have no fixed price
    @Override
    public double getPrice() {
        return 0.0; // price is determined after review
    }

    @Override
    public String toString() {
        return "CustomOrder{name=" + getCustomerName()
            + ", type=" + getProductType()
            + ", qty=" + quantity + "}";
    }
    
    @Override
    public String getOrderSummary() {
        return "Custom Order by: " + customerName + " | Type: " + getProductType();
    }
}