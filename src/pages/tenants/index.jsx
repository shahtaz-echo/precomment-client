import PageContainer from "@/components/container/page-container";
import React from "react";
import TenanatDetails from "./tenant-details";
import { Outlet, useParams } from "react-router";
import NavMenu from "./nav-menu";

const TenantPageLayout = () => {
  const { tenant_id } = useParams();
  return (
    <PageContainer>
      <div className="flex gap-12">
        <TenanatDetails tenant_id={tenant_id} />
        <div className="flex-1">
          <NavMenu tenant_id={tenant_id} />
          <Outlet />
        </div>
      </div>
    </PageContainer>
  );
};
export default TenantPageLayout;
