import React from "react";
import { useParams } from "react-router";
import FAQLinks from "./faq-links";

const TenantFaqPage = () => {
  const { tenant_id } = useParams();

  return (
    <div>
      <FAQLinks tenant_id={tenant_id} />
    </div>
  );
};

export default TenantFaqPage;
