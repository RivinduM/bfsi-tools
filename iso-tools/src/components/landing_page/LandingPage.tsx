import { Box } from "@mui/system";
import Banner from "./Banner";
import Tools from "./Tools";
import { Footer } from "../footer/Footer";
import { Header } from "./Header";
import ArticleBanner from "../article/ArticleBanner";
import Wso2Promotion from "../promotion/Wso2Promotion";

function LandingPage() {
  return (
    <Box color="text.primary">
      <Header></Header>
      <Banner></Banner>
      <Tools></Tools>
      {/* About WSO2 display area */}
          <Wso2Promotion></Wso2Promotion>

          {/* Articles display area */}
          <ArticleBanner></ArticleBanner>
      <Footer></Footer>
    </Box>
  );
}

export default LandingPage;
