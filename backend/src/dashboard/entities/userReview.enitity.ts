// src/dashboard/entities/dashboard.entity.ts

export class CountryTotalOrder {
    country: string;
    total_order: number;
  }
  
  export class RatingAmount {
    rating: number;
    total_amount: number;
  }
  
  export class RatingCount {
    rating: number;
    count: number;
  }
  
  export class RefundedProductName {
    productName: string;
    refundedCount: number;
  }
  