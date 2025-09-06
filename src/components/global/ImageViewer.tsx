import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
} from "lucide-react";

const ImageViewer: React.FC<{
  images: any[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ images, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetImageTransform();
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetImageTransform();
  };

  const resetImageTransform = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") onClose();
    if (e.key === "+" || e.key === "=") handleZoomIn();
    if (e.key === "-") handleZoomOut();
    if (e.key === "r" || e.key === "R") handleRotate();
    if (e.key === "0") resetImageTransform();
  };

  // Reset transform when image changes
  useEffect(() => {
    resetImageTransform();
  }, [currentIndex]);

  if (!isOpen || !images.length) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose} // Disable default close behavior
    >
      <DialogContent
        className="sm:max-w-7xl h-[85vh] p-0 gap-0 focus:outline-none [&>button]:hidden overflow-hidden"
        onKeyDown={handleKeyDown}
        onInteractOutside={(e) => e.preventDefault()} // Prevent closing on outside click
      >
        <div className="relative bg-background h-full pt-6">
          {/* Header Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-black/80 text-white hover:bg-black/90"
              >
                {currentIndex + 1} / {images.length}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/80 text-white hover:bg-black/90"
              >
                {Math.round(zoom * 100)}%
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="bg-primary/80 text-primary-foreground hover:bg-primary rounded-full h-8 w-8 p-0"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                className="bg-primary/80 text-primary-foreground hover:bg-primary rounded-full h-8 w-8 p-0"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              {/* Rotate Control */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="bg-primary/80 text-primary-foreground hover:bg-primary rounded-full h-8 w-8 p-0"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              {/* Reset Transform */}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetImageTransform}
                className="bg-primary/80 text-primary-foreground hover:bg-primary rounded-full h-8 w-8 p-0"
                title="Reset (Press 0)"
              >
                <Move className="h-4 w-4" />
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="bg-primary/80 text-primary-foreground hover:bg-primary rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Image Container */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              height: "calc(85vh - 140px)",
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={images[currentIndex]?.url || images[currentIndex]?.path}
              alt={`صورة ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg select-none transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                  position.y / zoom
                }px) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
              draggable={false}
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground hover:bg-primary rounded-full h-12 w-12 p-0 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground hover:bg-primary rounded-full h-12 w-12 p-0 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="border-t bg-muted/30 flex justify-center pt-2 mt-5">
              <div className="flex gap-3  ">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`cursor-pointer flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      index === currentIndex
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image?.url || image?.path}
                      alt={`مصغر ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
