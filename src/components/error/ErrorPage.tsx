import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Animated 404 Text */}
        <div className="relative cursor-pointer group" onClick={() => navigate('/')}>
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 select-none transition-all duration-300 group-hover:text-primary/30">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl font-bold text-primary animate-pulse group-hover:scale-110 transition-transform duration-300">
              4
              <span className="inline-block animate-bounce delay-100">0</span>
              <span className="inline-block animate-bounce delay-200">4</span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-stone-200 backdrop-blur-sm rounded-lg px-4 py-2 text-sm color:black  font-medium">
              اضغط للعودة للرئيسية
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4" >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors duration-300" onClick={handleGoHome}>
            الصفحة غير موجودة
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
        </div>

        {/* Alert Component */}
        <Alert className="max-w-md mx-auto border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors duration-300 group"  onClick={handleRefresh}>
          <Search className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
          <AlertDescription className="text-sm">
            الرابط المطلوب غير موجود على هذا الخادم. يرجى التحقق من الرابط أو العودة للصفحة الآمنة
            <span className="block text-xs text-primary mt-1 opacity-70 group-hover:opacity-100">اضغط لإعادة التحميل</span>
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" >
          <Button 
            onClick={handleGoHome}
            className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="border-primary cursor-pointer text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            رجوع
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleRefresh}
            className="cursor-pointer text-primary hover:bg-primary/10 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 mt-8">
          <div 
            className="w-3 h-3 bg-primary rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform duration-200" 
            onClick={handleGoHome}
          ></div>
          <div 
            className="w-3 h-3 bg-primary rounded-full animate-pulse delay-75 cursor-pointer hover:scale-150 transition-transform duration-200" 
            onClick={handleGoBack}
          ></div>
          <div 
            className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150 cursor-pointer hover:scale-150 transition-transform duration-200" 
            onClick={handleRefresh}
          ></div>
        </div>

        {/* Footer Text */}
        <div className="text-sm text-muted-foreground mt-8" >
          <p>رمز الخطأ: 404 | الصفحة غير موجودة</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;