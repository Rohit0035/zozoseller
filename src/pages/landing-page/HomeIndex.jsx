import React from 'react';
import SellerHeader from '../../components/seller/SellerHeader';
import SellerHero from '../../components/seller/SellerHero';
import "../../assets/styles/sellerpage.css"
import SellerCounter from '../../components/seller/SelllerCounter';
import WhySellWithUs from '../../components/seller/WhySellWithUs';
import SellerBenefits from '../../components/seller/SellerBenefits';
import SellerHowItWorks from '../../components/seller/SellerHowItWorks';
import SellerContactSection from '../../components/seller/SellerContactSection';
import SellerFooter from '../../components/seller/SellerFooter';

const HomeIndex = () => {
  return (
   <>
     <SellerHeader/>
     <SellerHero/>
     <SellerCounter/>
     <WhySellWithUs/>
     <SellerBenefits/>
     <SellerHowItWorks/>
     <SellerContactSection/>
     <SellerFooter/>
   </>
  );
};

export default HomeIndex;
