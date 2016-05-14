//---------------------------------------------------------------------------
#include "WebGL.h"
//---------------------------------------------------------------------------
using namespace LJF;
//---------------------------------------------------------------------------
#define INCH_TO_METER (0.0254)
#define METER_TO_INCH (1/0.0254)
//---------------------------------------------------------------------------

TGLBase::TGLBase()
  : FRC(0),FMinZoom(1E-7),FMaxZoom(1E7),FViewResolution(METER_TO_INCH*96,METER_TO_INCH*96)
{
  RECT rect = {0,0,1,1};
  FRect = FViewRect = rect,
  PositionFixed(false);
  ScaleFixed(false);
  DirectionFixed(true);
}

TGLBase::~TGLBase()
{
}

const TVector2D TGLBase::Size() const
{
  return TVector2D(FRect.right-FRect.left,FRect.bottom-FRect.top);
}

const TVector2D TGLBase::ViewSize() const
{
  return TVector2D(FViewRect.right-FViewRect.left,FViewRect.bottom-FViewRect.top);
}

void TGLBase::SetRectCenter(const RECT &rect0,RECT &rect,TPosition2D &center)
{
  rect = rect0;
  if (rect.right <= rect.left)
    rect.right = rect.left+1;
  if (rect.bottom <= rect.top)
    rect.bottom = rect.top+1;
    
  center.X = (rect.right+rect.left)/2.0;
  center.Y = (rect.bottom+rect.top)/2.0;
  FDViewCenter = Sgn(FViewCenter-FCenter);
}

const RECT& TGLBase::ViewRect() const
{
  return FViewRect;
}

void TGLBase::ViewRect(const RECT &viewrect)
{
  DoViewRect(viewrect);
}

void TGLBase::DoViewRect(const RECT &viewrect)
{
  SetRectCenter(viewrect,FViewRect,FViewCenter);
  FStdToView.X = (FViewRect.right-FViewRect.left)/2.0;
  FStdToView.Y = (FViewRect.bottom-FViewRect.top)/2.0;
  Rect(viewrect);
}

const RECT& TGLBase::Rect() const
{
  return FRect;
}

void TGLBase::Rect(const RECT &rect)
{
  SetRectCenter(rect,FRect,FCenter);
}

const TPosition2D& TGLBase::ViewCenter() const
{
  return FViewCenter;
}

const TVector2D& TGLBase::ViewResolution() const
{
  return FViewResolution;
}

void TGLBase::ViewResolution(const TVector2D &viewresolution)
{
  FViewResolution = viewresolution;
  if (FViewResolution.X <= 0)
    FViewResolution.X = 1;
  if (FViewResolution.Y <= 0)
    FViewResolution.Y = 1;
}

const TVector2D TGLBase::ViewResolutionDPI() const
{
  return FViewResolution*INCH_TO_METER;
}

void TGLBase::ViewResolutionDPI(const TVector2D &dpi)
{
  ViewResolution(dpi*METER_TO_INCH);
}

const TVector2D TGLBase::View_MeterToPixel(const TVector2D &meters) const
{
  return TVector2D(meters.X*FViewResolution.X,meters.Y*FViewResolution.Y);
}

const TVector2D TGLBase::View_PixelToMeter(const TVector2D &pixels) const
{
  return TVector2D(pixels.X/FViewResolution.X,pixels.Y/FViewResolution.Y);
}

const POINT TGLBase::ViewToScreen(const TPosition2D &point2d) const
{
  POINT point = { FloorToInt(point2d.X+FViewCenter.X)-FViewRect.left,FloorToInt(FViewCenter.Y-point2d.Y)-FViewRect.top };
  return point;
}

const TPosition2D TGLBase::ScreenToView(const POINT &point) const
{
  return TPosition2D(point.x+FViewRect.left-FViewCenter.X,FViewCenter.Y-point.y-FViewRect.top);
}

bool TGLBase::PositionFixed() const
{
  return GetFlag(OpenGL_PositionFixed);
}

void TGLBase::PositionFixed(bool fixed)
{
  SetFlag(OpenGL_PositionFixed,fixed);
}

bool TGLBase::ScaleFixed() const
{
  return GetFlag(OpenGL_ScaleFixed);
}

void TGLBase::ScaleFixed(bool fixed)
{
  SetFlag(OpenGL_ScaleFixed,fixed);
}

bool TGLBase::DirectionFixed() const
{
  return GetFlag(OpenGL_DirectionFixed);
}

void TGLBase::DirectionFixed(bool fixed)
{
  SetFlag(OpenGL_DirectionFixed,fixed);
}

bool TGLBase::MovingLimit() const
{
  return GetFlag(OpenGL_MovingLimit);
}

void TGLBase::MovingLimit(bool limit)
{
  SetFlag(OpenGL_MovingLimit,limit);
}

bool TGLBase::AutoBasePosition() const
{
  return GetFlag(OpenGL_AutoBasePosition);
}

void TGLBase::AutoBasePosition(bool flag)
{
  SetFlag(OpenGL_AutoBasePosition,flag);
}

double TGLBase::MinZoom() const
{
  return FMinZoom;
}

void TGLBase::MinZoom(double min_zoom)
{
  FMinZoom = min_zoom;
  if (FMinZoom <= 0)
    FMinZoom = 1E-7;
  Sort(FMinZoom,FMaxZoom);
}

double TGLBase::MaxZoom() const
{
  return FMaxZoom;
}

void TGLBase::MaxZoom(double max_zoom)
{
  FMaxZoom = max_zoom;
  if (FMaxZoom <= 0)
    FMaxZoom = 1E7;
  Sort(FMinZoom,FMaxZoom);
}

void TGLBase::GetAlignDelta(int width, int height, int align,int text_length,float &aligndx,float &aligndy)
{
  if (!align)
    align = 5;
    
  switch (align)
  {
    case 1:
      aligndx = 0;
      aligndy = height/2;
      break;

    case 2:
      aligndx = (text_length*width)/2;
      aligndy = height/2;
      break;

    case 3:
      aligndx = -(text_length*width);
      aligndy = height/2;
      break;

    case 4:
      aligndx = 0;;
      aligndy = 0;
      break;

    case 6:
      aligndx = (text_length*width);
      aligndy = 0;
      break;

    case 7:
      aligndx = 0;
      aligndy = -height/2;
      break;

    case 8:
      aligndx = (text_length*width)/2;
      aligndy = -height/2;
      break;

    case 9:
      aligndx = (text_length*width);
      aligndy = -height/2;

    default:
      aligndx = (text_length*width)/2;
      aligndy = 0;
      break;
  }
  //aligndx -= 0.25*width;
}

void TGLBase::GetAlignDelta(int align,int text_length,float &aligndx,float &aligndy)
{
  switch (align)
  {
  case 1:
    aligndx = 0.0f;
    aligndy = 0.0f;
    break;

  case 2:
    aligndx = text_length/4.0f;
    aligndy = 0.0f;
    break;

  case 3:
    aligndx = text_length/2.0f;
    aligndy = 0.0f;
    break;

  case 4:
    aligndx = 0.0f;
    aligndy = 1/2.0f;
    break;

  case 6:
    aligndx = text_length/2.0f;
    aligndy = 1/2.0f;
    break;

  case 7:
    aligndx = 0.0f;
    aligndy = 1.0f;
    break;

  case 8:
    aligndx = text_length/4.0f;
    aligndy = 1.0f;
    break;

  case 9:
    aligndx = text_length/2.0f;
    aligndy = 1.0f;
    break;
    
  default:
    aligndx = text_length/4.0f;
    aligndy = 1/2.0f;
    break;
  }
  aligndy -= 0.16f;
}

void TGLBase::GLString(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(align,len,aligndx,aligndy);
    glPushMatrix();
    glTranslated(position.X,position.Y,0);
    glRotated(direction,0,0,-1);
    glScalef(font_width,font_height,0);
    glTranslated(-aligndx,-aligndy,0);
    DrawGLString(text,fontname);//DoGLString(text,fontname);
    glPopMatrix();
  }
}

void TGLBase::GLString(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align,const char *fontname) const
{
  if (const int len = StrLength(text))
  {
    const double
      w = ~direction_width,
      h = ~direction_height;
    if (w>0 && h>0)
    {
      float aligndx,aligndy;
      const double mat[16]=
      {
        direction_width.X,direction_height.X,0,0,
        direction_width.Y,direction_height.Y,0,0,
        0,0,0,0,
        0,0,0,1
      };
      GetAlignDelta(align,len,aligndx,aligndy);
      glPushMatrix();
      glTranslated(position.X,position.Y,0);
      glMultMatrixd(mat);
      glScaled(1,1,0);
      glTranslated(-aligndx,-aligndy,0);
      DrawGLString(text,fontname);//DoGLString(text,fontname);
      glPopMatrix();
    }
  }
}

void TGLBase::GLString(const TPosition3D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(align,len,aligndx,aligndy);
    glPushMatrix();
    glTranslated(position.X,position.Y,position.Z);
    glRotated(direction,0,0,-1);
    glScalef(font_width,font_height,0/*(float)FScaleZ*/);
    glTranslated(-aligndx,-aligndy,0);
    DrawGLString(text,fontname);//DoGLString(text,fontname);
    glPopMatrix();
  }
}

void TGLBase::GLString(const TPosition3D &position,const char *text,
  const TVector3D &direction_width,const TVector3D &direction_height,
  float thickness,int align,const char *fontname) const
{
  if (const int len = StrLength(text))
  {
    const double
      w = ~direction_width,
      h = ~direction_height;
    if (w>0 && h>0)
    {
      float aligndx,aligndy;
      const TVector3D direction_thick(Sgn((direction_width&direction_height)));
      const double mat[16]=
      {
        direction_width.X,direction_width.Y,direction_width.Z,0,
        direction_height.X,direction_height.Y,direction_height.Z,0,
        direction_thick.X,direction_thick.Y,direction_thick.Z,0,
        0,0,0,1
      };

      GetAlignDelta(align,len,aligndx,aligndy);
      glPushMatrix();
      glTranslated(position.X,position.Y,position.Z);
      glMultMatrixd(mat);
      glScaled(1,1,thickness);
      glTranslated(-aligndx,-aligndy,0);
      DrawGLString(text,fontname);//DoGLString(text,fontname);
      glPopMatrix();
    }
  }
}

void TGLBase::GLString0(const TPosition2D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(10,10,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString0(text);//DoGLString0(text);
  }
}
void TGLBase::GLString0(const TPosition3D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(10,10,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString0(text);//DoGLString0(text);
  }
}
//-------------
#ifdef _M_X64
void TGLBase::GLString12(const TPosition2D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(12,12,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString12(text);//DoGLString0(text);
  }
}
void TGLBase::GLString12(const TPosition3D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(12,12,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString12(text);//DoGLString0(text);
  }
}
void TGLBase::GLString13(const TPosition2D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(13,13,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString13(text);//DoGLString0(text);
  }
}
void TGLBase::GLString13(const TPosition3D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(13,13,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString13(text);//DoGLString0(text);
  }
}
void TGLBase::GLString14(const TPosition2D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(14,13,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString14(text);//DoGLString0(text);
  }
}
void TGLBase::GLString14(const TPosition3D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(14,13,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString14(text);//DoGLString0(text);
  }
}
void TGLBase::GLString15(const TPosition2D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(15,15,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString15(text);//DoGLString0(text);
  }
}
void TGLBase::GLString15(const TPosition3D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(15,15,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString15(text);//DoGLString0(text);
  }
}
void TGLBase::GLString16(const TPosition2D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(16,16,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString16(text);//DoGLString0(text);
  }
}
void TGLBase::GLString16(const TPosition3D &position,const char *text,int align) const
{
  if (const int len = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(16,16,align,len,aligndx,aligndy);
    glRasterPos2i(RoundToInt(position.X-aligndx),FloorToInt(position.Y+aligndy));
    DrawGLString16(text);//DoGLString0(text);
  }
}
#endif
//-----------
void TGLBase::GLBlank(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  if (const int n = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(align,n,aligndx,aligndy);
    font_width *= 1.05f;
    font_height *= 1.1f;
    aligndx *= font_width;
    aligndy *= font_height;
    const TVector2D
      dir(-direction),
      alignv(aligndx,aligndy);
    glBegin(GL_QUADS);
      GLVertex2D((position+((TPosition2D(-alignv.X,-alignv.Y)%dir))));
      GLVertex2D((position+((TPosition2D(n*font_width/2-alignv.X,-alignv.Y)%dir))));
      GLVertex2D((position+((TPosition2D(n*font_width/2-alignv.X,font_height-alignv.Y)%dir))));
      GLVertex2D((position+((TPosition2D(-alignv.X,font_height-alignv.Y)%dir))));
    glEnd();
  }
}

void TGLBase::GLBlank(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align) const
{
  if (const int n = StrLength(text))
  {
    const double
      w = ~direction_width,
      h = ~direction_height;
    if (n>0 && w>0 && h>0)
    {
      float aligndx,aligndy;
      GetAlignDelta(align,n,aligndx,aligndy);
      TVector2D font_width = direction_width*1.05;
      TVector2D font_height = direction_height*1.1;
      TVector2D p(position-font_width*aligndx-font_height*aligndy);
      font_width *= n/2;
      glBegin(GL_QUADS);
        GLVertex2D(p.X);
        GLVertex2D((p+font_width));
        GLVertex2D((p+font_width+font_height));
        GLVertex2D((p+font_height));
      glEnd();
    }
  }
}

void TGLBase::GLBlank(const TPosition3D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  if (const int n = StrLength(text))
  {
    float aligndx,aligndy;
    GetAlignDelta(align,n,aligndx,aligndy);
    font_width *= 1.05f;
    font_height *= 1.1f;
    aligndx *= font_width;
    aligndy *= font_height;
    
    const TVector2D dp,
      dir(DegToRad(-direction)),
      alignv(aligndx,aligndy);
      
    glBegin(GL_QUADS);
      GLVertex3D((position+(TVector3D)((TPosition2D(-alignv.X,-alignv.Y)%dir))));
      GLVertex3D((position+(TVector3D)((TPosition2D(n*font_width/2-alignv.X,-alignv.Y)%dir))));
      GLVertex3D((position+(TVector3D)((TPosition2D(n*font_width/2-alignv.X,font_height-alignv.Y)%dir))));
      GLVertex3D((position+(TVector3D)((TPosition2D(-alignv.X,font_height-alignv.Y)%dir))));
    glEnd();
  }
}
/*
void TGLBase::DoGLString0(const char *text) const
{
}

void TGLBase::DoGLString(const char *text, const char *font_name) const
{
}
*/
//---------------------------------------------------------------------------

TGL2DBase::TGL2DBase()
{
  Reset();
}

const TPosition2D& TGL2DBase::BasePosition() const
{
  return FBasePosition;
}

const TVector2D TGL2DBase::MapScale() const
{
  return TVector2D(FMapScale.X,FMapScale.Y*FMapScale.X);
}

void TGL2DBase::MapScale(const TVector2D &mapscale)
{
  FMapScale = mapscale;
  if (FMapScale.X <= 0)
    FMapScale.X = 1;
  if (FMapScale.Y <= 0)
    FMapScale.Y = 1;
  FMapScale.Y /= FMapScale.X;
}

const TBound2D& TGL2DBase::ModelBound() const
{
  return FModelBound;
}

void TGL2DBase::ModelBound(const TBound2D &model_bound)
{
  FModelBound = model_bound;
  if (FModelBound.Valid())
  {
    if (AutoBasePosition() && ~BasePosition()<=0)
    {
      static const double step_xy=1000;
      FBasePosition = FModelBound.Center();
      FBasePosition = TPosition2D(Floor(BasePosition().X/step_xy),Floor(BasePosition().Y/step_xy))*step_xy;
    }         
  }
  else
  {
    FModelBound.SetBound(-1,-1);
    FModelBound.SetBound(1,1);
    FBasePosition = TPosition2D();
  }  
  FMapBound = ComputeMapBound();
}

void TGL2DBase::BeginLocal() const
{
  glPushMatrix();
  glLoadIdentity();
  glRotated(Direction(),0,0,1);
  glScaled(1/FMapScale.X,1/(FMapScale.X*FMapScale.Y),0);
}

void TGL2DBase::EndLocal() const
{
  glPopMatrix();
}

void TGL2DBase::BeginMap() const
{
  glPushMatrix();
  glLoadIdentity();
}

void TGL2DBase::EndMap() const
{
  glPopMatrix();
}

void TGL2DBase::BeginView() const
{
  glMatrixMode(GL_PROJECTION);
  glPushMatrix();
  glLoadIdentity();
  glOrtho(FDViewCenter.X-FStdToView.X,FDViewCenter.X+FStdToView.X,
      FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,0.0f,1.0f);
  glMatrixMode(GL_MODELVIEW);
  glPushMatrix();
  glLoadIdentity();
}

void TGL2DBase::EndView() const
{
  glMatrixMode(GL_PROJECTION);
  glPopMatrix();
  glMatrixMode(GL_MODELVIEW);
  glPopMatrix();
}

void TGL2DBase::BeginWin() const
{
  const RECT &rect = ViewRect();
  glMatrixMode(GL_PROJECTION);
  glPushMatrix();
  glLoadIdentity();
  glOrtho((float)rect.left,(float)rect.right,(float)rect.bottom,(float)rect.top,0.0f,1.0f);
  glMatrixMode(GL_MODELVIEW);
  glPushMatrix();
  glLoadIdentity();
}

void TGL2DBase::EndWin() const
{
  glMatrixMode(GL_PROJECTION);
  glPopMatrix();
  glMatrixMode(GL_MODELVIEW);
  glPopMatrix();
}

void TGL2DBase::GLString_Local(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  GLString(ModelToLocal(position),text,font_width,font_height,align,direction,fontname);
}

void TGL2DBase::GLString_Map(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  GLString(ModelToMap(position),text,font_width,font_height,align,direction,fontname);
}

void TGL2DBase::GLString_View(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  GLString(ModelToView(position),text,font_width,font_height,align,direction,fontname);
}


void TGL2DBase::GLString_Local(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align,
  const char *fontname) const
{
  GLString(ModelToLocal(position),text,direction_width,direction_height,align,fontname);
}

void TGL2DBase::GLString_Map(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align,
  const char *fontname) const
{
  GLString(ModelToMap(position),text,direction_width,direction_height,align,fontname);
}

void TGL2DBase::GLString_View(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align,
  const char *fontname) const
{
  GLString(ModelToView(position),text,direction_width,direction_height,align,fontname);
}

void TGL2DBase::GLString0_Local(const TPosition2D &position,const char *text,int align) const
{
  GLString0(ModelToLocal(position),text,align);
}

void TGL2DBase::GLString0_Map(const TPosition2D &position,const char *text,int align) const
{
  GLString0(ModelToMap(position),text,align);
}

void TGL2DBase::GLString0_View(const TPosition2D &position,const char *text,int align) const
{
  GLString0(ModelToView(position),text,align);
}

void TGL2DBase::GLBack_Local(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  GLBlank(ModelToLocal(position),text,font_width,font_height,align,direction);
}

void TGL2DBase::GLBack_Map(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  GLBlank(ModelToMap(position),text,font_width,font_height,align,direction);
}

void TGL2DBase::GLBack_View(const TPosition2D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  GLBlank(ModelToView(position),text,font_width,font_height,align,direction);
}

void TGL2DBase::GLBack_Local(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align) const
{
  GLBlank(ModelToLocal(position),text,direction_width,direction_height,align);
}

void TGL2DBase::GLBack_Map(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align) const
{
  GLBlank(ModelToMap(position),text,direction_width,direction_height,align);
}

void TGL2DBase::GLBack_View(const TPosition2D &position,const char *text,
  const TVector2D &direction_width,const TVector2D &direction_height,int align) const
{
  GLBlank(ModelToView(position),text,direction_width,direction_height,align);
}

const TBound2D TGL2DBase::ComputeMapBound() const
{
  TBound2D mapbds;
  if (FModelBound.Valid())
  {
    mapbds.SetBound(ModelToMap(FModelBound.Min()));
    mapbds.SetBound(ModelToMap(FModelBound.Max()));
  }
  return mapbds;
}

bool TGL2DBase::Move(const TPosition2D &from,const TPosition2D &to)
{
  return Move(to-from);
}

const TVector2D TGL2DBase::ProcessMovement(const TVector2D &move) const
{
  TVector2D tmp_move(PositionFixed() ? TVector2D() : move);
  if (PositionXYFixed1())
  {
    if (Abs(tmp_move.X) < Abs(tmp_move.Y))
    {
      if (PositionYFixed())
        tmp_move.Y = 0;
      else
        tmp_move.X = 0;  
    }
    else
    {
      if (PositionXFixed())
        tmp_move.X = 0;
      else
        tmp_move.Y = 0;  
    }
  }
  if (PositionXFixed())
    tmp_move.X = 0;
  if (PositionYFixed())
    tmp_move.Y = 0;
  return tmp_move;    
}

bool TGL2DBase::Move(const TVector2D &move)
{
  const TVector2D tmp_move(ProcessMovement(move));
  if (!IsZero(tmp_move))
  {
    DoMove(tmp_move);
    return true;
  }
  return true;
}

bool TGL2DBase::DoMove(const TVector2D &move)
{
  TVector2D view_move(move);
  if (!IsZero(view_move))
  {
    if (FMapBound.Valid() && MovingLimit())
    {
      TBound2D view_bound;
      view_bound.SetBound(MapToView(FMapBound.Min()));
      view_bound.SetBound(MapToView(FMapBound.Max()));
      const TVector2D
        view_bound_size(view_bound.Size()),
        view_size(ViewSize());
      if (view_bound_size.X > view_size.X)
      {
        view_move.X = Min(view_move.X,view_move.X,-view_bound.Min().X-view_size.X/2);
        view_move.X = Max(view_move.X,view_move.X,-view_bound.Max().X+view_size.X/2);
      }
      else
      {
        view_move.X = Max(view_move.X,view_move.X,-view_bound.Min().X-view_size.X/2);
        view_move.X = Min(view_move.X,view_move.X,-view_bound.Max().X+view_size.X/2);
      }
      if (view_bound_size.Y > view_size.Y)
      {
        view_move.Y = Min(view_move.Y,view_move.Y,-view_bound.Min().Y-view_size.Y/2);
        view_move.Y = Max(view_move.Y,view_move.Y,-view_bound.Max().Y+view_size.Y/2);
      }
      else
      {
        view_move.Y = Max(view_move.Y,view_move.Y,-view_bound.Min().Y-view_size.Y/2);
        view_move.Y = Min(view_move.Y,view_move.Y,-view_bound.Max().Y+view_size.Y/2);
      }
    }
    if (!IsZero(view_move))
    {
      MapCenter -= ViewToMap_Vector(view_move);
      return true;
    }
  }
  return false;
}

void TGL2DBase::DoMoveToCenter(const TPosition2D &from)
{
  DoMove(-from);
}

void TGL2DBase::DoMoveCenterTo(const TPosition2D &to)
{
  DoMove(to);
}

bool TGL2DBase::DoZoom(double scale)
{
  if (scale != 1)
    return DoZoom(scale,scale);
  return false;
}

bool TGL2DBase::DoZoom(double scalex,double scaley)
{
  if (!ScaleFixed() && (scalex!=1 || scaley!=1))
  {
    FViewScale.X *= scalex;
    FViewScale.X = Clamp((double)MinZoom(),FViewScale.X,(double)MaxZoom());
    FViewScale.Y *= scaley/scalex;
    FViewScale.Y = Clamp((double)MinZoom(),FViewScale.Y,(double)MaxZoom());
    return true;
  }
  return false;
}

bool TGL2DBase::DoZoomIn()
{
  return DoZoom(1.25);
}

bool TGL2DBase::DoZoomOut()
{
  return DoZoom(1/1.25);
}

bool TGL2DBase::Zoom(const TPosition2D &position,double scale)
{
  if (!ScaleFixed() && scale!=1)
  {
    DoMoveToCenter(position);
    DoZoom(scale);
    DoMoveCenterTo(position);
    return true;
  }
  return false;
}

bool TGL2DBase::Zoom(const TPosition2D &position,double scalex,double scaley)
{
  if (!ScaleFixed() && scalex && scaley)
  {
    DoMoveToCenter(position);
    DoZoom(scalex,scaley);
    DoMoveCenterTo(position);
    return true;
  }
  return false;
}

bool TGL2DBase::ZoomIn(const TPosition2D &position)
{
  if (!ScaleFixed())
  {
    DoMoveToCenter(position);
    DoZoomIn();
    DoMoveCenterTo(position);
    return true;
  }
  return false;
}

bool TGL2DBase::ZoomOut(const TPosition2D &position)
{
  if (!ScaleFixed())
  {
    DoMoveToCenter(position);
    DoZoomOut();
    DoMoveCenterTo(position);
    return true;
  }
  return false;
}

bool TGL2DBase::ZoomRect(const TInterval2D &rect,bool identityxy)
{
  bool rst = false;
  const TPosition2D tmp_center(ProcessMovement(rect.Center()));
  if (!IsZero(tmp_center))
  {
    DoMoveToCenter(tmp_center);
    rst = true;
  }
  if (!ScaleFixed())
  {
    const TVector2D size(rect.Size());
    const RECT vrect = ViewRect();
    const int
      W = vrect.right-vrect.left-1,
      H = vrect.bottom-vrect.top-1;
    if (size.X>0 && size.Y>0)
    {
      const double
        sx = W/size.X,
        sy = H/size.Y;
      if (identityxy)
      {
        if (DoZoom(Min(sx,sy)))
          rst = true;
      }
      else
      {
        if (DoZoom(sx,sy))
          rst = true;
      }
    }
    else if (size.X > 0)
    {
      if (DoZoom(W/size.X))
        rst = true;
    }
    else if (size.Y > 0)
    {
      if (DoZoom(H/size.Y))
        rst = true;
    }
    else
    {
      FViewScale.X = FViewScale.Y = 1;
      rst = true;
    }
  }
  return rst;
}

void TGL2DBase::ZoomExtent(bool identityxy)
{
  if (FModelBound.Valid() && FMapBound.Valid())
  {
    const RECT rect = Rect();
    const SIZE size = { rect.right-rect.left, rect.bottom-rect.top };
    const TVector2D mapsize = View_MeterToPixel(FMapBound.Size());
    MapCenter = FMapBound.Center();
    if (!ScaleFixed())
    {
      if (mapsize.X>0 && mapsize.Y>0)
      {
        const double
          sx = size.cx/mapsize.X,
          sy = size.cy/mapsize.Y;
        if (identityxy)
        {
          FViewScale.X = 0.95*Min(sx,sy);
          FViewScale.Y = 1;
        }
        else
        {
          FViewScale.X = 0.95*sx;
          FViewScale.Y = sy/sx;
        }
      }
      else if (mapsize.X > 0)
      {
        FViewScale.X = 0.95*size.cx/mapsize.X;
        FViewScale.Y = 1;
      }
      else if (mapsize.Y > 0)
      {
        FViewScale.X = 0.95*size.cy/mapsize.Y;
        FViewScale.Y = 1;
      }
      else
        FViewScale.X = FViewScale.Y = 1;
    }
    else
      MapCenter.X = MapCenter.Y = 0;
  }
  else
  {
    MapCenter.X = MapCenter.Y = 0;
    if (!ScaleFixed())
      FViewScale.X = FViewScale.Y = 1;
  }
  FLODScale0 = ~FViewScale;
}

void TGL2DBase::GLVertex_Local(const TPosition2D &point) const
{
  GLVertex2D(ModelToLocal(point));
}

void TGL2DBase::GLVertex_Map(const TPosition2D &point) const
{
  GLVertex2D(ModelToMap(point));
}

void TGL2DBase::GLVertex_View(const TPosition2D &point) const
{
  GLVertex2D(ModelToView(point));
}

void TGL2DBase::GLVertex_Local(const TPosition2D &p1,const TPosition2D &p2) const
{
  GLVertex_Local(p1);
  GLVertex_Local(p2);
}

void TGL2DBase::GLVertex_Map(const TPosition2D &p1,const TPosition2D &p2) const
{
  GLVertex_Map(p1);
  GLVertex_Map(p2);
}

void TGL2DBase::GLVertex_View(const TPosition2D &p1,const TPosition2D &p2) const
{
  GLVertex_View(p1);
  GLVertex_View(p2);
}

void TGL2DBase::GLVertex_Local(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3) const
{
  GLVertex_Local(p1);
  GLVertex_Local(p2);
  GLVertex_Local(p3);
}

void TGL2DBase::GLVertex_Map(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3) const
{
  GLVertex_Map(p1);
  GLVertex_Map(p2);
  GLVertex_Map(p3);
}

void TGL2DBase::GLVertex_View(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3) const
{
  GLVertex_View(p1);
  GLVertex_View(p2);
  GLVertex_View(p3);
}

void TGL2DBase::GLVertex_Local(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3,const TPosition2D &p4) const
{
  GLVertex_Local(p1);
  GLVertex_Local(p2);
  GLVertex_Local(p3);
  GLVertex_Local(p4);
}

void TGL2DBase::GLVertex_Map(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3,const TPosition2D &p4) const
{
  GLVertex_Map(p1);
  GLVertex_Map(p2);
  GLVertex_Map(p3);
  GLVertex_Map(p4);
}

void TGL2DBase::GLVertex_View(const TPosition2D &p1,const TPosition2D &p2,const TPosition2D &p3,const TPosition2D &p4) const
{
  GLVertex_View(p1);
  GLVertex_View(p2);
  GLVertex_View(p3);
  GLVertex_View(p4);
}

void TGL2DBase::Project() const
{
  const RECT vrect = ViewRect();
  glViewport(0,0,vrect.right-vrect.left,vrect.bottom-vrect.top);
  glMatrixMode(GL_PROJECTION);
  glLoadIdentity();
  glOrtho(FDViewCenter.X-FStdToView.X,FDViewCenter.X+FStdToView.X,
      FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,0.0f,1.0f);
  glScaled(FViewScale.X*FViewResolution.X,FViewScale.X*FViewScale.Y*FViewResolution.Y,1.0);
  glTranslated(-MapCenter.X,-MapCenter.Y,0);
  glMatrixMode(GL_MODELVIEW);
  glLoadIdentity();
  glRotated(Direction(),0,0,1);
  glScaled(1/FMapScale.X,1/(FMapScale.X*FMapScale.Y),0);
  glTranslated(-FBasePosition.X,-FBasePosition.Y,0);
};

void TGL2DBase::Reset()
{
  FDirection.X = 1;
  FDirection.Y = 0;
  FViewScale.X = FViewScale.Y = 1;
  MapCenter.X = MapCenter.Y = 0;
  FMapScale.X = FMapScale.Y = 1;
}

double TGL2DBase::Direction() const
{
  return RadToDeg(!FDirection);
}

bool TGL2DBase::Direction(double direction)
{
  if (!DirectionFixed())
  {
    FDirection = DegToRad(direction);
    return true;
  }
  return false;
}

bool TGL2DBase::Rotate(double angle)
{
  if (!DirectionFixed() && angle!=0)
    return Direction(Direction()+angle);
  return false;
}

const TPosition2D  TGL2DBase::ModelToLocal(const TPosition2D &position) const
{
  return position-FBasePosition;
}

const TPosition2D  TGL2DBase::LocalToModel(const TPosition2D &local_position) const
{
  return FBasePosition+local_position;
}

const TPosition2D TGL2DBase::ModelToMap(const TPosition2D &position) const
{
  TPosition2D p(ModelToLocal(position)/FMapScale.X);
  p.Y /= FMapScale.Y;
  return p%FDirection;
}

const TVector2D TGL2DBase::ModelToMap_Vector(const TVector2D &vector) const
{
  TVector2D v(vector/FMapScale.X);
  v.Y /= FMapScale.Y;
  return v%FDirection;
}

const TPosition2D TGL2DBase::MapToModel(const TPosition2D &map_position) const
{
  TVector2D p((map_position*FMapScale.X)%(*FDirection));
  p.Y *= FMapScale.Y;;
  return LocalToModel(p);
}

const TVector2D TGL2DBase::MapToModel_Vector(const TVector2D &map_vector) const
{
  TVector2D v((map_vector*FMapScale.X)%(*FDirection));
  v.Y *= FMapScale.Y;
  return v;
}

const TPosition2D TGL2DBase::MapToView(const TPosition2D &map_position) const
{
  const TPosition2D p((map_position-MapCenter)*FViewScale.X);
  return View_MeterToPixel(TVector2D(p.X,p.Y*FViewScale.Y))-FDViewCenter;
}

const TVector2D TGL2DBase::MapToView_Vector(const TVector2D &map_vector) const
{
  const TVector2D v(map_vector*FViewScale.X);
  return View_MeterToPixel(TVector2D(v.X,v.Y*FViewScale.Y));
}

const TPosition2D TGL2DBase::ViewToMap(const TPosition2D &view_position) const
{
  const TPosition2D p(View_PixelToMeter(view_position+FDViewCenter)/FViewScale.X);
  return TVector2D(p.X,p.Y/FViewScale.Y)+MapCenter;
}

const TVector2D TGL2DBase::ViewToMap_Vector(const TVector2D &view_vector) const
{
  const TPosition2D v(View_PixelToMeter(view_vector)/FViewScale.X);
  return TVector2D(v.X,v.Y/FViewScale.Y);
}

const TPosition2D TGL2DBase::ViewToModel(const TPosition2D &view_position) const
{
  return MapToModel(ViewToMap(view_position));
}

const TPosition2D TGL2DBase::ViewToModel_Vector(const TVector2D &view_vector) const
{
  return MapToModel_Vector(ViewToMap_Vector(view_vector));
}

const TPosition2D TGL2DBase::ModelToView(const TPosition2D &position) const
{
  return MapToView(ModelToMap(position));
}

void TGL2DBase::ModelToView(const TPosition2Ds &positions,TPosition2Ds &view_positions) const
{
  const int n = positions.Count();
  view_positions.Resize(n);
  for (int k=0; k<n; ++k)
    view_positions[k] = ModelToView(positions[k]);
}

const TVector2D TGL2DBase::ModelToView_Vector(const TVector2D &vector) const
{
  return MapToView_Vector(ModelToMap_Vector(vector));
}

void TGL2DBase::AssignTansformData(const TGL2DBase &glbase)
{
  const TVector2D resolution_ratio(glbase.FViewResolution.X/FViewResolution.X,glbase.FViewResolution.Y/FViewResolution.Y);
  FFlags = glbase.FFlags;
  FDirection = glbase.FDirection;
  FViewScale = glbase.FViewScale;
  FViewScale.X *= resolution_ratio.X;
  FViewScale.Y *= resolution_ratio.Y;
  FMapBound = glbase.FMapBound;
  MapCenter = glbase.MapCenter;
  FMapScale = glbase.FMapScale;
  FBasePosition = glbase.FBasePosition;
  FModelBound = glbase.FModelBound;
}

void TGL2DBase::ViewScale(const TVector2D &viewscale)
{
  if (!ScaleFixed())
  {
    FViewScale.X = FMapScale.X/viewscale.X;
    FViewScale.Y = FMapScale.X*FMapScale.Y/(viewscale.Y*FViewScale.X);
  }
}

const TVector2D TGL2DBase::ViewScale() const
{
  return TVector2D(FMapScale.X/FViewScale.X,
                   FMapScale.X*FMapScale.Y/(FViewScale.X*FViewScale.Y));
}

float TGL2DBase::LODLevel() const
{
  return float(~ViewScale()/FLODScale0);
}

void TGL2DBase::DrawViewGridXY(float delta) const
{
  if (FDirection.X==1 || FDirection.Y==0)                         
  {
    TBound2D bds;
    const RECT vrect = ViewRect();
    if (vrect.right>vrect.left && vrect.bottom>vrect.top)
    {
      const TPosition2D p((vrect.right-vrect.left)/2.0,(vrect.bottom-vrect.top)/2.0);
      bds.SetBound(ViewToModel(-p));
      bds.SetBound(ViewToModel(p));
      if (bds.Valid())
      {
        const float delt = Max((float)BestNumber(delta*ViewScale().X),1.0f);
        const RECT rect =
        {
          CeilToInt(bds.Min().X/delt),CeilToInt(bds.Min().Y/delt),
          FloorToInt(bds.Max().X/delt),FloorToInt(bds.Max().Y/delt)
        };
        BeginView();
        glBegin(GL_LINES);
        for (int x=rect.left; x<=rect.right; ++x)
        {
          GLVertex2D(ModelToView(TPosition2D(x*delt,bds.Min().Y)).X);
          GLVertex2D(ModelToView(TPosition2D(x*delt,bds.Max().Y)).X);
        }
        for (int y=rect.top; y<=rect.bottom; ++y)
        {
          GLVertex2D(ModelToView(TPosition2D(bds.Min().X,y*delt)).X);
          GLVertex2D(ModelToView(TPosition2D(bds.Max().X,y*delt)).X);
        }
        glEnd();

        TViewRect vr;
        const RECT vrect = ViewRect();
        vr.SetRect(TVector2D(vrect.right-vrect.left,vrect.bottom-vrect.top));

        for (int x=rect.left; x<=rect.right; ++x)
        {
          TPosition2D
            p1 = ModelToView(TPosition2D(x*delt,bds.Min().Y)),
            p2 = ModelToView(TPosition2D(x*delt,bds.Max().Y));
          if (vr.RectLine(p1,p2))
          {
            TVector2D v = p2-p1;
            const double length = ~v;
            if (length > 0)
            {
              v /= length/2;
              const float direction = -(float)RadToDeg(!v);
              TStr str = NumberToStr(x*delt,2)+"Y";
              GLString(p1+v,str.c_str(),14,17,7,direction);
              GLString(p2-v,str.c_str(),14,17,9,direction);
            }
          }
        }

        for (int y=rect.top; y<=rect.bottom; ++y)
        {
          TPosition2D
            p1 = ModelToView(TPosition2D(bds.Min().X,y*delt)),
            p2 = ModelToView(TPosition2D(bds.Max().X,y*delt));
          if (vr.RectLine(p1,p2))
          {
            TVector2D v = p2-p1;
            const double length = ~v;
            if (length > 0)
            {
              v /= length/2;
              const float direction = -(float)RadToDeg(!v);
              TStr str = NumberToStr(y*delt,2)+"X";
              GLString(p1+v,str.c_str(),14,17,7,direction);
              GLString(p2-v,str.c_str(),14,17,9,direction);
            }
          }
        }
        EndView();
      }
    }
  }
}

void TGL2DBase::DrawViewGridXY(float deltax,float deltay,
  float &deltx,float &delty,RECT &rect,bool Drawflag) const
{
  TBound2D bds;
  const RECT vrect = ViewRect();
  if (vrect.right>vrect.left && vrect.bottom>vrect.top)
  {
    const TPosition2D p((vrect.right-vrect.left)/2.0,(vrect.bottom-vrect.top)/2.0);
    bds.SetBound(ViewToModel(-p));
    bds.SetBound(ViewToModel(p));

    if (bds.Valid())
    {
      deltx = (float)BestNumber(deltax*ViewScale().X);
      if (deltx < 1)
        deltx = 1;
        
      delty = (float)BestNumber(deltay*ViewScale().Y);
      if (delty < 1)
        delty = 1;

      rect.left = CeilToInt(bds.Min().X/deltx);
      rect.right = FloorToInt(bds.Max().X/deltx);
      rect.top = CeilToInt(bds.Min().Y/delty);
      rect.bottom = FloorToInt(bds.Max().Y/delty);
      
      if (Drawflag)
      {
        BeginView();
        glBegin(GL_LINES);
        
        for (int x=rect.left; x<=rect.right; ++x)
        {
          GLVertex2D(ModelToView(TPosition2D(x*deltx,bds.Min().Y)));
          GLVertex2D(ModelToView(TPosition2D(x*deltx,bds.Max().Y)));
        }

        for (int y=rect.top; y<=rect.bottom; ++y)
        {
          GLVertex2D(ModelToView(TPosition2D(bds.Min().X,y*delty)));
          GLVertex2D(ModelToView(TPosition2D(bds.Max().X,y*delty)));
        }

        glEnd();
        EndView();
      }
    }
  }
}

void TGL2DBase::DrawViewGridXY(HDC dc,const RECT &boundrect,
  float deltx,float delty,const RECT &rect,bool inverse) const
{
/*
  if (dc)
  {
    LOGFONT lf;
    int pw(canvas->Pen->Width);

    canvas->Pen->Width = 1;
    canvas->Brush->Style = bsClear;
    HRGN rgn = CreateRectRgn(boundrect.left,boundrect.top-25,boundrect.right,boundrect.bottom+25);
    rgn = SelectObject(canvas->Handle,rgn);
    canvas->Font->Height = 14;
    char str[32];
    for (int x=rect.left; x<=rect.right; ++x)
    {
      float t = x*deltx;
      POINT p(ViewToScreen(ModelToView(TPosition2D(t,0))));
      sprintf(str,"%.0lf",t);
      TSize size(canvas->TextExtent(str));
      int tt = boundrect.Left+p.x-size.cx/2;
      canvas->DrawString(tt,boundrect.Top-size.cy-5,str);
      canvas->DrawString(tt,boundrect.Bottom+5,str);

      tt = boundrect.Left+p.x;
      canvas->MoveTo(tt,boundrect.Top);
      canvas->LineTo(tt,boundrect.Top-5);
      canvas->MoveTo(tt,boundrect.Bottom);
      canvas->LineTo(tt,boundrect.Bottom+5);
    }

    rgn = SelectObject(canvas->Handle,rgn);
    DeleteObject(rgn);
    rgn = CreateRectRgn(boundrect.left-25,boundrect.top,boundrect.right+25,boundrect.bottom);
    rgn = SelectObject(canvas->Handle,rgn);
    ZeroMemory(&lf,sizeof(LOGFONT));
    lf.lfHeight = 14;
    lf.lfCharSet = DEFAULT_CHARSET;
    strcpy(lf.lfFaceName,"MS Sans Serif");
    lf.lfEscapement = 10 * 90;
    lf.lfOrientation = 10 * 90;
    HFONT font0 = canvas->Font->Handle;
    HFONT font = CreateFontIndirect(&lf);
    canvas->Font->Handle = font;
    for (int y=rect.top; y<=rect.bottom; ++y)
    {
      float t = y*delty;
      POINT p(ViewToScreen(ModelToView(TPosition2D(0,t))));
      sprintf(str,"%.0lf",inverse ? -t : t);
      TSize size(canvas->TextExtent(str));
      int tt = boundrect.Top+p.y+size.cy/2;
      canvas->DrawString(boundrect.Left-size.cx-5,tt,str);
    }
    canvas->Font->Handle = font0;
    DeleteObject(font);
    lf.lfEscapement = 10*270;
    lf.lfOrientation = 10*270;
    font = CreateFontIndirect(&lf);
    canvas->Font->Handle = font;
    for (int y=rect.top; y<=rect.bottom; ++y)
    {
      float t = y*delty;
      POINT p(ViewToScreen(ModelToView(TPosition2D(0,t))));
      sprintf(str,"%.0lf",inverse ? -t : t);
      TSize size(canvas->TextExtent(str));
      int tt = boundrect.Top+p.y-size.cy/2;
      canvas->DrawString(boundrect.Right+size.cx+5,tt,str);
    }
    canvas->Font->Handle = font0;
    DeleteObject(font);

    for (int y=rect.top; y<=rect.bottom; ++y)
    {
      float t = y*delty;
      POINT p(ViewToScreen(ModelToView(TPosition2D(0,t))));
      int tt = boundrect.Top+p.y;
      canvas->MoveTo(boundrect.Left,tt);
      canvas->LineTo(boundrect.Left-5,tt);
      canvas->MoveTo(boundrect.Right,tt);
      canvas->LineTo(boundrect.Right+5,tt);
    }

    canvas->Pen->Width = pw;
    rgn = SelectObject(canvas->Handle,rgn);
    DeleteObject(rgn);
  }
*/  
}

void TGL2DBase::DrawCapturedPoint(const TPosition2D &point) const
{
  static const int N = 3;
  static const TRGBColor Colors[4] =
  {
    TRGBColor(1,1,0),TRGBColor(1,0,0),TRGBColor(1,1,0),TRGBColor(0,0,0)
  };

  BeginView();
  for (int k=0; k<=N; ++k)
  {
    glBegin(GL_LINE_LOOP);
      glColor3fv(&Colors[k].Red);
      GLVertex2D(TPosition2D(point.X-k-N,point.Y-k-N));
      GLVertex2D(TPosition2D(point.X+k+N,point.Y-k-N));
      GLVertex2D(TPosition2D(point.X+k+N,point.Y+k+N));
      GLVertex2D(TPosition2D(point.X-k-N,point.Y+k+N));
    glEnd();
  }
  EndView();
}
  
bool TGL2DBase::PositionXFixed() const
{
  return GetFlag(OpenGL_PositionXFixed);
}

void TGL2DBase::PositionXFixed(bool fixed)
{
  SetFlag(OpenGL_PositionXFixed,fixed);
}

bool TGL2DBase::PositionYFixed() const
{
  return GetFlag(OpenGL_PositionYFixed);
}

void TGL2DBase::PositionYFixed(bool fixed)
{
  SetFlag(OpenGL_PositionYFixed,fixed);
}

bool TGL2DBase::PositionXYFixed1() const
{
  return GetFlag(OpenGL_PositionXYFixed1);
}

void TGL2DBase::PositionXYFixed1(bool fixed)
{
  SetFlag(OpenGL_PositionXYFixed1,fixed);
}

//-----------------------------------------------------------------------------

TGL3DBase::TGL3DBase()
  : FViewToLocalValid(false),FView3DType(vtNone),FFoci(0.25),FRefViewZ(0)
{
  Reset();
  FRotateMatrix.Identify();
  FRotateMatrix.RotateModel(TVector3D(-1,0,0),60);
  FRotateMatrix.RotateModel(TVector3D(0,0,1),45);
  ScaleZFixed(false);
  DistanceFixed(false);
  DirectionFixed(false);
  //FFixedDepth(false);
  //FMode2D(false);
}

const char * TGL3DBase::View3DTypeName() const
{
  static const char* const FView3DTypeName[] =
  {
    "视图","顶视图","底视图","前视图","后视图","左视图","右视图"
  };
  return FView3DTypeName[FView3DType];
}

TView3DType TGL3DBase::View3DType() const
{ 
  return FView3DType; 
}
bool TGL3DBase::FFixedDepth() const
{
  return GetFlag(0x1000);
}
void TGL3DBase::FFixedDepth(bool b)
{
  SetFlag(0x1000,b);
}
bool TGL3DBase::FMode2D() const
{
  return GetFlag(0x2000);
}
void TGL3DBase::FMode2D(bool b)
{
  SetFlag(0x2000,b);
}
bool TGL3DBase::Mode2D() const
{
  return FMode2D();
}
bool TGL3DBase::Mode2D(bool mode2d)
{
  bool rst = false;
  if (FMode2D() != mode2d)
  {
    rst = View3DType(mode2d?vtTop:vtNone);
    FMode2D(mode2d);
  }
  return rst;
}
bool TGL3DBase::View3DType(TView3DType view_type)
{
  if (FView3DType != view_type)
  {
    DirectionFixed(false);
    switch (FView3DType=view_type)
    {
      case vtTop:
        FRotateMatrix.Identify();
        break;

      case vtBottom:
        FRotateMatrix.Identify();
        FRotateMatrix.RotateModel(TVector3D(0,1,0),180);
        break;

      case vtFront:
        FRotateMatrix.Identify();
        FRotateMatrix.RotateModel(TVector3D(-1,0,0),90);
        break;

      case vtBack:
        FRotateMatrix.Identify();
        FRotateMatrix.RotateModel(TVector3D(-1,0,0),90);
        FRotateMatrix.RotateModel(TVector3D(0,0,1),180);
        break;

      case vtLeft:
        FRotateMatrix.Identify();
        FRotateMatrix.RotateModel(TVector3D(-1,0,0),90);
        FRotateMatrix.RotateModel(TVector3D(0,0,1),90);
        break;

      case vtRight:
        FRotateMatrix.Identify();
        FRotateMatrix.RotateModel(TVector3D(-1,0,0),90);
        FRotateMatrix.RotateModel(TVector3D(0,0,-1),90);
        break;

      default:
        FView3DType = vtNone;
        return false;
    }
    DirectionFixed(true);
    return true;
  }
  return false;
}

const TBound3D& TGL3DBase::ModelBound() const 
{ 
  return FModelBound; 
}

void TGL3DBase::ModelBound(const TBound3D &model_bound)
{
  if (!FModelBound.Valid() && model_bound.Valid())
    FRefPosition = model_bound.Center();
  FModelBound = model_bound;
  if (FModelBound.Valid())
  {
    static const int
      step_xy = 1000,
      step_z = 100;
    FModelCenter = FModelBound.Center();
    if (AutoBasePosition() && ~FBasePosition<=0)
    {
      FBasePosition = TPosition3D(TPosition2D(Floor(FModelCenter.X/step_xy),
          Floor(FModelCenter.Y/step_xy))*step_xy,Floor(FModelCenter.Z/step_z)*step_z);
    }
  }
  else
    FBasePosition = TPosition3D();
}

TPosition3D& TGL3DBase::RefPosition()
{
  return FRefPosition;
}

const TPosition3D& TGL3DBase::RefPosition() const
{
  return FRefPosition;
}

const TPosition3D& TGL3DBase::BasePosition() const
{ 
  return FBasePosition; 
}

double TGL3DBase::ViewScale() const 
{ 
  return FViewScale; 
}

double TGL3DBase::ScaleZ() const
{
  return FScaleZ;
}

double TGL3DBase::ViewScaleZ() const
{
  return FViewScale * FScaleZ;
}

void TGL3DBase::GLString_Local(const TPosition3D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  GLString(ModelToLocal(position),text,font_width,font_height,align,direction,fontname);
}

void TGL3DBase::GLString_View(const TPosition3D &position,const char *text,
  float font_width,float font_height,int align,float direction,const char *fontname) const
{
  GLString(ModelToView(position),text,font_width,font_height,align,direction,fontname);
}

void TGL3DBase::GLString0_Local(const TPosition3D &position,const char *text,int align) const
{
  GLString0(ModelToLocal(position),text,align);
}

void TGL3DBase::GLString0_View(const TPosition3D &position,const char *text,int align) const
{
  GLString0(ModelToView(position),text,align);
}

void TGL3DBase::GLBack_Local(const TPosition3D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  GLBlank(ModelToLocal(position),text,font_width,font_height,align,direction);
}
void TGL3DBase::GLBack_View(const TPosition3D &position,const char *text,
  float font_width,float font_height,int align,float direction) const
{
  GLBlank(ModelToView(position),text,font_width,font_height,align,direction);
}

void TGL3DBase::GLString_Local(const TPosition3D &position,const char *text,
  const TVector3D &direction_width,const TVector3D &direction_height,
  float thickness,int align,const char *fontname) const
{
  GLString(ModelToLocal(position),text,direction_width,direction_height,thickness,align,fontname);
}

void TGL3DBase::GLString_View(const TPosition3D &position,const char *text,
  const TVector3D &direction_width,const TVector3D &direction_height,
  float thickness,int align,const char *fontname) const
{
  GLString(ModelToView(position),text,direction_width,direction_height,thickness,align,fontname);
}

void TGL3DBase::AssignTansformData(const TGL3DBase &glbase)
{
  TVector2D resolution_ratio(glbase.FViewResolution.X/FViewResolution.X, glbase.FViewResolution.Y/FViewResolution.Y);
  FFlags = glbase.FFlags;
  FModelCenter = glbase.FModelCenter;
  FModelBound = glbase.FModelBound;
  FBasePosition = glbase.FBasePosition;
  FRotateMatrix = glbase.FRotateMatrix;
  FProjectMatrix = glbase.FProjectMatrix;
  FModelMatrix = glbase.FModelMatrix;
  FLocalToMap = glbase.FLocalToMap;
  FMapToLocal = glbase.FMapToLocal;
  FLocalToView = glbase.FLocalToView;
  FLocalToView.ScaleView(TVector3D(resolution_ratio.X,resolution_ratio.Y,1));
  FViewToLocal = glbase.FViewToLocal;
  FLocalToView.ScaleView(TVector3D(1/resolution_ratio.X,1/resolution_ratio.Y,1));
  FViewScale = glbase.FViewScale;
  FScaleZ = glbase.FScaleZ;
  FView3DType = glbase.FView3DType;
  FViewToLocalValid = glbase.FViewToLocalValid;
}

const double* TGL3DBase::GetProjectMatrix() const
{
  return FProjectMatrix;
}

const double* TGL3DBase::GetModelMatrix() const
{
  return FModelMatrix;
}

void TGL3DBase::GenMatrixes() const
{
  glPushMatrix();
  glTranslated(FBasePosition.X-FModelCenter.X,FBasePosition.Y-FModelCenter.Y,FBasePosition.Z-FModelCenter.Z);
  glGetDoublev(GL_MODELVIEW_MATRIX,FLocalToMap);
  FLocalToMap.InverseTo(FMapToLocal);
  FLocalToView.Compose(FProjectMatrix,FLocalToMap);
  FViewToLocalValid = FLocalToView.InverseTo(FViewToLocal);
  glPopMatrix();
  glTranslated(-FModelCenter.X,-FModelCenter.Y,-FModelCenter.Z);
  glGetDoublev(GL_MODELVIEW_MATRIX,FModelMatrix);
}

void TGL3DBase::GLVertex_Local(const TPosition3D &point) const
{
  GLVertex3D(ModelToLocal(point));
}

void TGL3DBase::GLVertex_Map(const TPosition3D &point) const
{
  GLVertex3D(ModelToMap(point));
}

void TGL3DBase::GLVertex_View(const TPosition3D &point) const
{
  GLVertex3D(ModelToView(point));
}

void TGL3DBase::GLVertex_Local(const TPosition3D &p1, const TPosition3D &p2) const
{
  GLVertex3D(ModelToLocal(p1),ModelToLocal(p2));
}

void TGL3DBase::GLVertex_Map(const TPosition3D &p1, const TPosition3D &p2) const
{
  GLVertex3D(ModelToMap(p1),ModelToMap(p2));
}

void TGL3DBase::GLVertex_View(const TPosition3D &p1, const TPosition3D &p2) const
{
  GLVertex3D(ModelToView(p1),ModelToView(p2));
}

void TGL3DBase::GLVertex_Local(const TPosition3D &p1,const TPosition3D &p2,bool ccw) const
{
  GLVertex3D(ModelToLocal(p1),ModelToLocal(p2),ccw);
}

void TGL3DBase::GLVertex_Map(const TPosition3D &p1,const TPosition3D &p2,bool ccw) const
{
  GLVertex3D(ModelToMap(p1),ModelToMap(p2),ccw);
}

void TGL3DBase::GLVertex_View(const TPosition3D &p1,const TPosition3D &p2,bool ccw) const
{
  GLVertex3D(ModelToView(p1),ModelToView(p2),ccw);
}

void TGL3DBase::GLVertex_Local(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3) const
{
  GLVertex3D(ModelToLocal(p1),ModelToLocal(p2),ModelToLocal(p3));
}

void TGL3DBase::GLVertex_Map(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3) const
{
  GLVertex3D(ModelToMap(p1),ModelToMap(p2),ModelToMap(p3));
}

void TGL3DBase::GLVertex_View(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3) const
{
  GLVertex3D(ModelToView(p1),ModelToView(p2),ModelToView(p3));
}

void TGL3DBase::GLVertex_Local(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,bool ccw) const
{
  GLVertex3D(ModelToLocal(p1),ModelToLocal(p2),ModelToLocal(p3),ccw);
}

void TGL3DBase::GLVertex_Map(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,bool ccw) const
{
  GLVertex3D(ModelToMap(p1),ModelToMap(p2),ModelToMap(p3),ccw);
}

void TGL3DBase::GLVertex_View(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,bool ccw) const
{
  GLVertex3D(ModelToView(p1),ModelToView(p2),ModelToView(p3),ccw);
}

void TGL3DBase::GLVertex_Local(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4) const
{
  GLVertex3D(ModelToLocal(p1),ModelToLocal(p2),ModelToLocal(p3),ModelToLocal(p4));
}

void TGL3DBase::GLVertex_Map(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4) const
{
  GLVertex3D(ModelToMap(p1),ModelToMap(p2),ModelToMap(p3),ModelToMap(p4));
}

void TGL3DBase::GLVertex_View(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4) const
{
  GLVertex3D(ModelToView(p1),ModelToView(p2),ModelToView(p3),ModelToView(p4));
}

void TGL3DBase::GLVertex_Local(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4,bool ccw) const
{
  GLVertex3D(ModelToLocal(p1),ModelToLocal(p2),ModelToLocal(p3),ModelToLocal(p4),ccw);
}

void TGL3DBase::GLVertex_Map(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4,bool ccw) const
{
  GLVertex3D(ModelToMap(p1),ModelToMap(p2),ModelToMap(p3),ModelToMap(p4),ccw);
}

void TGL3DBase::GLVertex_View(const TPosition3D &p1,const TPosition3D &p2,const TPosition3D &p3,const TPosition3D &p4,bool ccw) const
{
  GLVertex3D(ModelToView(p1),ModelToView(p2),ModelToView(p3),ModelToView(p4),ccw);
}

void TGL3DBase::GLVertex_Locals(TPosition3D &p1, TPosition3D &p2, const TPosition3D &p3, const TPosition3D &p4) const
{
  GLVertex3Ds(p1,p2,ModelToLocal(p3),ModelToLocal(p4));
}

void TGL3DBase::GLVertex_Maps(TPosition3D &p1, TPosition3D &p2, const TPosition3D &p3, const TPosition3D &p4) const
{
  GLVertex3Ds(p1,p2,ModelToMap(p3),ModelToMap(p4));
}

void TGL3DBase::GLVertex_Views(TPosition3D &p1, TPosition3D &p2, const TPosition3D &p3, const TPosition3D &p4) const
{
  GLVertex3Ds(p1,p2,ModelToView(p3),ModelToView(p4));
}

void TGL3DBase::GLVertex_Locals(TPosition3D &p1, TPosition3D &p2, const TPosition3D &p3, const TPosition3D &p4,bool ccw) const
{
  GLVertex3Ds(p1,p2,ModelToLocal(p3),ModelToLocal(p4),ccw);
}

void TGL3DBase::GLVertex_Maps(TPosition3D &p1, TPosition3D &p2, const TPosition3D &p3, const TPosition3D &p4,bool ccw) const
{
  GLVertex3Ds(p1,p2,ModelToMap(p3),ModelToMap(p4),ccw);
}

void TGL3DBase::GLVertex_Views(TPosition3D &p1, TPosition3D &p2, const TPosition3D &p3, const TPosition3D &p4,bool ccw) const
{
  GLVertex3Ds(p1,p2,ModelToView(p3),ModelToView(p4),ccw);
}

bool TGL3DBase::Project() const
{
  const RECT vrect = ViewRect();
  glViewport(0,0,vrect.right-vrect.left,vrect.bottom-vrect.top);
  glMatrixMode(GL_PROJECTION);
  glLoadIdentity();
  if (FModelBound.Valid())
  {
    const double size = ~FModelBound.Size()/FViewScale;
    glOrtho(FDViewCenter.X-FStdToView.X,FDViewCenter.X+FStdToView.X,
        FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,size*(0.5-FFoci),size*(1.5+FFoci));
    glTranslated(0,0,-size);
  }
  else
    glOrtho(FDViewCenter.X-FStdToView.X,FDViewCenter.Y+FStdToView.X,FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,0.0f,1.0f);
  glScaled(1/FViewScale,1/FViewScale,1/FViewScale);
  glGetDoublev(GL_PROJECTION_MATRIX,FProjectMatrix);
  glMatrixMode(GL_MODELVIEW);
  glLoadIdentity();
  glMultMatrixd(FRotateMatrix);
  glScaled(1,1,1/FScaleZ);
  GenMatrixes();
  FRefViewZ = ModelToView(FRefPosition).Z;
  return FModelBound.Valid();
}
bool TGL3DBase::Project(float offset) const
{
  const RECT vrect = ViewRect();
  glViewport(0,0,vrect.right-vrect.left,vrect.bottom-vrect.top);
  glMatrixMode(GL_PROJECTION);
  glLoadIdentity();
  glTranslatef(offset,0.0f,0.0f);
  if (FModelBound.Valid())
  {
    const double size = ~FModelBound.Size()/FViewScale;
    glFrustum(FDViewCenter.X-FStdToView.X,FDViewCenter.X+FStdToView.X,
        FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,size*(0.5-FFoci),size*(1.5+FFoci));
    glTranslated(0,0,-size);
    glScaled(3,3,1);
  }
  else
    glOrtho(FDViewCenter.X-FStdToView.X,FDViewCenter.Y+FStdToView.X,FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,0.0f,1.0f);
  glScaled(1/FViewScale,1/FViewScale,1/FViewScale);
  glGetDoublev(GL_PROJECTION_MATRIX,FProjectMatrix);
  glMatrixMode(GL_MODELVIEW);
  glLoadIdentity();
  glMultMatrixd(FRotateMatrix);
  glScaled(1,1,1/FScaleZ);
  GenMatrixes();
  FRefViewZ = ModelToView(FRefPosition).Z;
  return FModelBound.Valid();
}

void TGL3DBase::BeginLocal() const
{
  glPushMatrix();
  glLoadIdentity();
  glMultMatrixd(FRotateMatrix);
  glScaled(1,1,1/FScaleZ);
  glTranslated(FBasePosition.X-FModelCenter.X,FBasePosition.Y-FModelCenter.Y,FBasePosition.Z-FModelCenter.Z);
}

void TGL3DBase::EndLocal() const
{
  glPopMatrix();
}

void TGL3DBase::BeginMap() const
{
  glPushMatrix();
  glLoadIdentity();
}

void TGL3DBase::EndMap() const
{
  glPopMatrix();
}

void TGL3DBase::BeginView() const
{
  glMatrixMode(GL_PROJECTION);
  glPushMatrix();
  glLoadIdentity();
  glOrtho(FDViewCenter.X-FStdToView.X,FDViewCenter.X+FStdToView.X,FDViewCenter.Y-FStdToView.Y,FDViewCenter.Y+FStdToView.Y,0.0f,1.0f);
  glMatrixMode(GL_MODELVIEW);
  glPushMatrix();
  glLoadIdentity();
}

void TGL3DBase::EndView() const
{
  glMatrixMode(GL_PROJECTION);
  glPopMatrix();
  glMatrixMode(GL_MODELVIEW);
  glPopMatrix();
}

void TGL3DBase::BeginWin() const
{
  const RECT &rect = ViewRect();
  glMatrixMode(GL_PROJECTION);
  glPushMatrix();
  glLoadIdentity();
  glOrtho((float)rect.left,(float)rect.right,(float)rect.bottom,(float)rect.top,0.0f,1.0f);
  glMatrixMode(GL_MODELVIEW);
  glPushMatrix();
  glLoadIdentity();
}

void TGL3DBase::EndWin() const
{
  glMatrixMode(GL_PROJECTION);
  glPopMatrix();
  glMatrixMode(GL_MODELVIEW);
  glPopMatrix();
}

void TGL3DBase::Reset()
{
  FViewScale = FScaleZ = 1;
  FModelCenter = TPosition3D();
  FModelBound.Clear();
  FRotateMatrix.Identify();
}

const TPosition3D TGL3DBase::FModelToView(const TPosition3D &position) const
{
  TPosition3D point = (position-FModelCenter);
  point.Z /= FScaleZ;
  return FRotateMatrix*point/FViewScale;
}

const TVector3D TGL3DBase::StdToView(const TVector3D &std) const
{
  return TVector3D(std.X*FStdToView.X,std.Y*FStdToView.Y,-std.Z);
}

const TVector3D TGL3DBase::ViewToStd(const TVector3D &view) const
{
  return TVector3D(view.X/FStdToView.X,view.Y/FStdToView.Y,-view.Z);
}

bool TGL3DBase::FixedDepth() const
{
  return FFixedDepth();
}

bool TGL3DBase::FixedDepth(bool fixed)
{
  if (FFixedDepth() != fixed)
  {
    FFixedDepth(fixed);
    return true;
  }
  return false;
}

void TGL3DBase::GenViewBound(TBound2D &view_bound) const
{
  view_bound.Clear();
  if (FModelBound.Valid())
  {
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Min().X,FModelBound.Min().Y,FModelBound.Min().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Min().X,FModelBound.Min().Y,FModelBound.Max().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Min().X,FModelBound.Max().Y,FModelBound.Min().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Min().X,FModelBound.Max().Y,FModelBound.Max().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Max().X,FModelBound.Min().Y,FModelBound.Min().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Max().X,FModelBound.Min().Y,FModelBound.Max().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Max().X,FModelBound.Max().Y,FModelBound.Min().Z)));
    view_bound.SetBound(FModelToView(TPosition3D(FModelBound.Max().X,FModelBound.Max().Y,FModelBound.Max().Z)));
  }
}

bool TGL3DBase::MoveD(double move)
{
  if (move != 0)
  {
    TPosition3D p0,p;
    TVector3D v;
    if (ViewToLocal(p0,TVector3D(0,0,move/1000),p,v))
    {
      FModelCenter += v;
      return true;
    }
  }
  return false;
}
                           
bool TGL3DBase::DoMove(const TVector2D &move)
{
  if (!IsZero(move))
  {
    TPosition3D p0,p;
    TVector3D v;
    if (ViewToLocal(p0,move,p,v))
    {
      FModelCenter -= v;
      return true;
    }
  }
  return false;
}

bool TGL3DBase::Move(const TPosition2D &from,const TPosition2D &to)
{
  return Move(to-from);
}

bool TGL3DBase::Move(const TVector2D &move)
{
  if (!PositionFixed())
    return DoMove(move);
  return false;  
}

bool TGL3DBase::DoZoom(double scale)
{
  if (!ScaleFixed() && scale!=1)
  {
    const double view_scale = Clamp(MinZoom(),FViewScale/scale,MaxZoom());
    if (view_scale != FViewScale)
    {
      FViewScale = view_scale;
      return true;
    }
  }
  return false;
}

bool TGL3DBase::Zoom(const TPosition2D &center,double scale)
{
  if (!ScaleFixed() && scale!=1)
  {
    FViewScale /= scale;
    if (FViewScale < MinZoom())
    {
      scale *= MinZoom()/FViewScale;
      FViewScale = MinZoom();
    }
    else if (FViewScale > MaxZoom())
    {
      scale *= MaxZoom()/FViewScale;
      FViewScale = MaxZoom();
    }
    DoMove((center)*(1-scale));
    return true;
  }
  return false;
}

bool TGL3DBase::DoZoomIn()
{
  return DoZoom(1.25);
}

bool TGL3DBase::ZoomIn(const TPosition2D &center)
{
  return Zoom(center,1.25);
}

bool TGL3DBase::DoZoomOut()
{
  return DoZoom(1/1.25);
}

bool TGL3DBase::ZoomOut(const TPosition2D &center)
{
  return Zoom(center,1/1.25);
}

bool TGL3DBase::ZoomRect(const TInterval2D &rect)
{
  if (!ScaleFixed())
  {
    const TVector2D size(rect.Size());
    if (size.X>0 && size.Y>0)
    {
      const RECT vrect = ViewRect();
      const double scale = Min((vrect.right-vrect.left)/size.X,(vrect.bottom-vrect.top)/size.Y);
      DoMove(-rect.Center());
      DoZoom(scale);
      return true;
    }
  }
  return false;
}

float TGL3DBase::LODLevel() const
{
  return float(FViewScale/FLODScale0);
}

void TGL3DBase::ZoomExtent(bool identify)
{
  if (identify)
    FScaleZ = 1;
  FModelCenter = FModelBound.Center();
  TBound2D view_bounds;
  GenViewBound(view_bounds);                                             
  if (view_bounds.Valid())
  {
    const TVector2D size = view_bounds.Size();
    const TPosition2D center = view_bounds.Center();
    if (size.X>0 && size.Y>0)
      DoZoom(0.95*Min(ViewSize().X/size.X,ViewSize().Y/size.Y));
  }
  else
    FViewScale = 1;
  FLODScale0 = FViewScale;
}

bool TGL3DBase::DoZoomZ(double scalez)
{
  if (!ScaleZFixed() && scalez!=1)
  {
    if (scalez > 0)
    {
      FScaleZ /= scalez;
      if (FScaleZ > 1000)
        FScaleZ = 1000;
      if (FScaleZ < 0.001)
        FScaleZ = 0.001;
    }
    else
      FScaleZ = 1;
    return true;
  }
  return false;
}

bool TGL3DBase::ZoomZ(const TPosition2D &center,double scalez)
{
  if (!ScaleZFixed() && scalez!=1)
  {
    if (scalez > 0)
    {
      FScaleZ /= scalez;
      if (FScaleZ > 1000)
      {
        scalez *= 1000/FScaleZ;
        FScaleZ = 1000;
      }
      else if (FScaleZ < 0.001)
      {
        scalez *= 0.001/FScaleZ;
        FScaleZ = 0.001;
      }
      if (FModelBound.Valid())
      {
        TPosition3D p(FModelBound.Center());
        TVector3D v(0,0,1);
        if (FLocalToView.Transform(ModelToLocal(p),v,p,v))
        {
          TVector2D vv(v);
          if (~vv > 0)
          {
            TVector2D ct(center/vv);
            DoMove(TVector2D(ct.X*(1-scalez),0)%vv);
          }
        }
      }
    }
    else
      FScaleZ = 1;
    return true;
  }
  return false;
}

bool TGL3DBase::Rotate(double angle,const TVector3D &direction)
{
  if (!DirectionFixed())
  {
    FRotateMatrix.RotateView(direction,angle);
    return true;
  }
  return false;
}

bool TGL3DBase::RotateZ(double angle)
{
  if (!DirectionFixed())
  {
    FRotateMatrix.RotateModel(TVector3D(0,0,1),angle);
    return true;
  }
  return false;
}

const TPosition3D TGL3DBase::ModelToLocal(const TPosition3D &position) const
{
  return position-FBasePosition;
}

const TPosition3D TGL3DBase::LocalToModel(const TPosition3D &local_position) const
{
  return FBasePosition+local_position;
}

const TPosition3D TGL3DBase::LocalToView(const TPosition3D &local_position) const
{
  TPosition3D view_position;
  FLocalToView.Transform(local_position,view_position);
  return StdToView(view_position);
}

bool TGL3DBase::LocalToView(const TPosition3D &local_position,TPosition3D &view_position) const
{
  if (FLocalToView.Transform(local_position,view_position))
  {
    view_position = StdToView(view_position);
    return true;
  }
  return false;
}

bool TGL3DBase::ViewToLocal(const TPosition3D &view_position,TPosition3D &local_position) const
{
  if (FViewToLocalValid)
    return FViewToLocal.Transform(ViewToStd(view_position),local_position);
  return false;
}

bool TGL3DBase::LocalToView(const TPosition3D &local_position,
  const TVector3D &local_vector,TPosition3D &view_position,TVector3D &view_vector) const
{
  if (FLocalToView.Transform(local_position,local_vector,view_position,view_vector))
  {
    view_position = StdToView(view_position);
    view_vector = StdToView(view_vector);
    return true;
  }
  return false;
}

bool TGL3DBase::ViewToLocal(const TPosition3D &view_position,
  const TVector3D &view_vector,TPosition3D &local_position,TVector3D &local_vector) const
{
  if (FViewToLocalValid)
    return FViewToLocal.Transform(ViewToStd(view_position),ViewToStd(view_vector),local_position,local_vector);
  return false;
}

bool TGL3DBase::LocalToView(const TPosition3D &local_position,const TVector3D &local_vector1,
  const TVector3D &local_vector2,const TVector3D &local_vector3,TPosition3D &view_position,
  TVector3D &view_vector1,TVector3D &view_vector2,TVector3D &view_vector3) const
{
  if (FLocalToView.Transform(local_position,local_vector1,local_vector2,local_vector3,
        view_position,view_vector1,view_vector2,view_vector3))
  {
    view_position = StdToView(view_position);
    view_vector1 = StdToView(view_vector1);
    view_vector2 = StdToView(view_vector2);
    view_vector3 = StdToView(view_vector3);
    return true;
  }
  return false;
}

bool TGL3DBase::ViewToLocal(const TPosition3D &view_position,const TVector3D &view_vector1,
  const TVector3D &view_vector2,const TVector3D &view_vector3,TPosition3D &local_position,
  TVector3D &local_vector1,TVector3D &local_vector2,TVector3D &local_vector3) const
{
  if (FViewToLocalValid)
  {
    return FViewToLocal.Transform(
      ViewToStd(view_position),ViewToStd(view_vector1),
      ViewToStd(view_vector2),ViewToStd(view_vector3),
      local_position,local_vector1,local_vector2,local_vector3);
  }
  return false;
}

const TPosition3D TGL3DBase::ModelToView(const TPosition3D &position) const
{
  return LocalToView(ModelToLocal(position));
}

bool TGL3DBase::ModelToView(const TPosition3Ds &positions, TPosition2Ds &view_positions) const
{
  const int n = positions.Count();
  view_positions.Resize(n);
  TPosition3D view_position;
  bool resault = true;
  for (int k=0; k<n; ++k)
  {
    if (!ModelToView(positions[k],view_position))
      resault = false;
    view_positions[k] = view_position;
  }
  return resault;
}

bool TGL3DBase::ModelToView(const TPosition3Ds &positions, TPosition3Ds &view_positions) const
{
  const int n = positions.Count();
  view_positions.Resize(n);
  bool resault = true;
  for (int k=0; k<n; ++k)
  {
    if (!ModelToView(positions[k],view_positions[k]))
      resault = false;
  }
  return resault;
}

bool TGL3DBase::ModelToView(const TPosition3D &position,TPosition3D &view_position) const
{
  return LocalToView(ModelToLocal(position),view_position);
}

bool TGL3DBase::ViewToModel(const TPosition3D &view_position,TPosition3D &position) const
{
  if (ViewToLocal(view_position,position))
  {
    position = LocalToModel(position);
    return true;
  }
  return false;
}

bool TGL3DBase::ViewToModel(const TPosition2D &view_position,TPosition3D &position) const
{
  if (ViewToLocal(TPosition3D(view_position,FRefViewZ),position))
  {
    position = LocalToModel(position);
    return true;
  }
  return false;
}

bool TGL3DBase::ModelToView(const TPosition3D &position,
  const TVector3D &vector,TPosition3D &view_position,TVector3D &view_vector) const
{
  return LocalToView(ModelToLocal(position),vector,view_position,view_vector);
}

bool TGL3DBase::ViewToModel(const TPosition3D &view_position,
  const TVector3D &view_vector,TPosition3D &position,TVector3D &vector) const
{
  if (ViewToLocal(view_position,view_vector,position,vector))
  {
    position = LocalToModel(position);
    return true;
  }
  return false;
}

bool TGL3DBase::ModelToView(const TPosition3D &position,const TVector3D &vector1,
  const TVector3D &vector2,const TVector3D &vector3,TPosition3D &view_position,
  TVector3D &view_vector1,TVector3D &view_vector2,TVector3D &view_vector3) const
{
  return LocalToView(ModelToLocal(position),vector1,vector2,
    vector3,view_position,view_vector1,view_vector2,view_vector3);
}

bool TGL3DBase::ViewToModel(const TPosition3D &view_position,const TVector3D &view_vector1,
  const TVector3D &view_vector2,const TVector3D &view_vector3,TPosition3D &position,
  TVector3D &vector1,TVector3D &vector2,TVector3D &vector3) const
{
  if (ViewToLocal(view_position,view_vector1,view_vector2,
        view_vector3,position,vector1,vector2,vector3))
  {
    position = LocalToModel(position);
    return true;
  }
  return false;
}

const TPosition3D TGL3DBase::ModelToMap(const TPosition3D &position) const
{
  return FLocalToMap*ModelToLocal(position);
}

const TPosition3D TGL3DBase::MapToModel(const TPosition3D &map_position) const
{
  return LocalToModel(FMapToLocal*map_position);
}

void TGL3DBase::ModelToMap(const TPosition3D &position,
  const TVector3D &vector,TPosition3D &map_position,TVector3D &map_vector) const
{
  FLocalToMap.Transform(ModelToLocal(position),vector,map_position,map_vector);
}

void TGL3DBase::MapToModel(const TPosition3D &map_position,
  const TVector3D &map_vector,TPosition3D &position,TVector3D &vector) const
{
  FMapToLocal.Transform(map_position,map_vector,position,vector);
  position = LocalToModel(position);
}

bool TGL3DBase::ScaleZFixed() const
{
  return GetFlag(OpenGL_ScaleZFixed);
}

void TGL3DBase::ScaleZFixed(bool fixed)
{
  SetFlag(OpenGL_ScaleZFixed,fixed);
}

bool TGL3DBase::DistanceFixed() const
{
  return GetFlag(OpenGL_DistanceFixed);
}

void TGL3DBase::DistanceFixed(bool fixed)
{
  SetFlag(OpenGL_DistanceFixed,fixed);
}

bool TGL3DBase::GenLocalDirectionsOxyz(float radius,
  TPosition3D &p0,TPosition3D &px,TPosition3D &py,TPosition3D &pz) const
{
  if (radius>0 && FModelBound.Valid())
  {
    TPosition3D p;
    TVector3D vx0,vy0,vz0;
    if (ModelToView(FModelBound.Center(),TVector3D(1,0,0),TVector3D(0,1,0),TVector3D(0,0,1),p,vx0,vy0,vz0))
    {
      vz0 *= FScaleZ;
      double length = Sqrt(vx0*vx0+vy0*vy0+vz0*vz0);
      if (length > 0)
      {
        p0 = View_MeterToPixel(TPosition2D(radius,radius))*0.0008;
        length /= (~p0)/1.5;
        vx0 /= length;
        vy0 /= length;
        vz0 /= length;
        
        POINT point = { FloorToInt(p0.X)+1,FloorToInt(ViewRect().bottom-2-p0.Y) };
        p0 = ScreenToView(point);
        p0.Z = 0;
        px = p0+vx0;
        py = p0+vy0;
        pz = p0+vz0;
        
        TPosition3D vx,vy,vz;
        if (ViewToLocal(p0,vx0,vy0,vz0,p,vx,vy,vz))
        {
          TPosition3D pp0,pp;
          const TPosition3D 
            ppx1 = p+vx*0.9,
            ppx2 = p-vx*0.9,
            ppy1 = p+vy*0.9,
            ppy2 = p-vy*0.9,
            ppz1 = p+vz*0.9,
            ppz2 = p-vz*0.9;
          const int
            n = 32,
            d = n/2;

          glColor3f(1.0f,0.5f,0.5f);
          glBegin(GL_TRIANGLE_FAN);
          GLVertex3D(ppx1);
          pp0 = p+vy*0.1;
          GLVertex3D(pp0);
          for (int k=1; k<=n; ++k)
          {
            const double t = k*(REALD_PI/d);
            pp = p+(vy*Cos(t)+vz*Sin(t))*0.1;
            GLNormal(ppx1,pp0,pp);
            GLVertex3D(pp);
            pp0 = pp;
          }
          glEnd();
          
          glColor3f(0.7f,0.2f,0.2f);
          glBegin(GL_TRIANGLE_FAN);
          GLVertex3D(ppx2);
          pp0 = p+vy*0.1;
          GLVertex3D(pp0);
          for (int k=1; k<=n; ++k)
          {
            const double t = -k*(REALD_PI/d);
            pp = p+(vy*Cos(t)+vz*Sin(t))*0.1;
            GLNormal(ppx2,pp0,pp);
            GLVertex3D(pp);
            pp0 = pp;
          }
          glEnd();

          glColor3f(0.5f,1.0f,0.5f);
          glBegin(GL_TRIANGLE_FAN);
          GLVertex3D(ppy1);
          pp0 = p+vz*0.1;
          GLVertex3D(pp0);
          for (int k=1; k<=n; ++k)
          {
            const double t = k*(REALD_PI/d);
            pp = p+(vx*Sin(t)+vz*Cos(t))*0.1;
            GLNormal(ppy1,pp0,pp);
            GLVertex3D(pp);
            pp0 = pp;
          }
          glEnd();

          glColor3f(0.2f,0.7f,0.2f);
          glBegin(GL_TRIANGLE_FAN);
          GLVertex3D(ppy2);
          pp0 = p+vz*0.1;
          GLVertex3D(pp0);
          for (int k=1; k<=n; ++k)
          {
            const double t = -k*(REALD_PI/d);
            pp = p+(vx*Sin(t)+vz*Cos(t))*0.1;
            GLNormal(ppy2,pp0,pp);
            GLVertex3D(pp);
            pp0 = pp;
          }
          glEnd();

          glColor3f(0.5f,0.5f,1.0f);
          glBegin(GL_TRIANGLE_FAN);
          GLVertex3D(ppz1);
          pp0 = p+vx*0.1;
          GLVertex3D(pp0);
          for (int k=1; k<=n; ++k)
          {
            const double t = k*(REALD_PI/d);
            pp = p+(vx*Cos(t)+vy*Sin(t))*0.1;
            GLNormal(ppz1,pp0,pp);
            GLVertex3D(pp);
            pp0 = pp;
          }
          glEnd();
          
          glColor3f(0.2f,0.2f,0.7f);
          glBegin(GL_TRIANGLE_FAN);
          GLVertex3D(ppz2);
          pp0 = p+vx*0.1;
          GLVertex3D(pp0);
          for (int k=1; k<=n; ++k)
          {
            const double t = -k*(REALD_PI/d);
            pp = p+(vx*Cos(t)+vy*Sin(t))*0.1;
            GLNormal(ppz2,pp0,pp);
            GLVertex3D(pp);
            pp0 = pp;
          }
          glEnd();
          return true;
        }
      }
    }
  }
  return false;
}

void TGL3DBase::DrawViewDirections(const TPosition3D&,
  const TPosition3D &px,const TPosition3D &py,const TPosition3D &pz)
{
  glBegin(GL_LINES);

  glColor3f(1.0f,0.5f,0.5f);  //X
  GLVertex3D((px+TVector2D(-2,-2)));
  GLVertex3D((px+TVector2D(2,2)));
  GLVertex3D((px+TVector2D(2,2)));
  GLVertex3D((px+TVector2D(-2,-2)));
  GLVertex3D((px+TVector2D(2,-2)));
  GLVertex3D((px+TVector2D(-2,2)));
  GLVertex3D((px+TVector2D(-2,2)));
  GLVertex3D((px+TVector2D(2,-2)));

  glColor3f(0.5f,1.0f,0.5f);  //Y
  GLVertex3D((py+TVector2D(0,0)));
  GLVertex3D((py+TVector2D(-3,3)));
  GLVertex3D((py+TVector2D(0,0)));
  GLVertex3D((py+TVector2D(3,3)));
  GLVertex3D((py+TVector2D(0,0)));
  GLVertex3D((py+TVector2D(0,-3)));
  
  glColor3f(0.5f,0.5f,1.0f);  //Z
  GLVertex3D((pz+TVector2D(-2,2)));
  GLVertex3D((pz+TVector2D(3,2)));
  GLVertex3D((pz+TVector2D(2,2)));
  GLVertex3D((pz+TVector2D(-3,-2)));
  GLVertex3D((pz+TVector2D(-2,-2)));
  GLVertex3D((pz+TVector2D(3,-2)));

  glEnd();
}
void TGL3DBase::DrawViewDirections(const TPosition3D&,
  const TPosition3D &px,const TPosition3D &py,const TPosition3D &pz,
  const TPosition3D &qx,const TPosition3D &qy,const TPosition3D &qz)
{
  glBegin(GL_LINES);

  glColor3f(1.0f,0.5f,0.5f);
  GLVertex3D((px+TVector2D(-3,0)),(px+TVector2D(2,0)));     //E
  GLVertex3D((px+TVector2D(-3,0)),(px+TVector2D(-3,-3)));
  GLVertex3D((px+TVector2D(-3,0)),(px+TVector2D(-3,3)));
  GLVertex3D((px+TVector2D(-3,-3)),(px+TVector2D(3,-3)));
  GLVertex3D((px+TVector2D(-3,3)),(px+TVector2D(3,3)));

  GLVertex3D((qx+TVector2D(-2,3)),(qx+TVector2D(-3,3)));    //W
  GLVertex3D((qx+TVector2D(-3,3)),(qx+TVector2D(-2,-3)));
  GLVertex3D((qx+TVector2D(-2,-3)),(qx+TVector2D(0,3)));
  GLVertex3D((qx+TVector2D(2,3)),(qx+TVector2D(3,3)));
  GLVertex3D((qx+TVector2D(3,3)),(qx+TVector2D(2,-3)));
  GLVertex3D((qx+TVector2D(2,-3)),(qx+TVector2D(0,3)));

  glColor3f(0.5f,1.0f,0.5f);  
  GLVertex3D((py+TVector2D(3,3)),(py+TVector2D(2,-3)));     //N
  GLVertex3D((py+TVector2D(2,-3)),(py+TVector2D(-2,3)));
  GLVertex3D((py+TVector2D(-2,3)),(py+TVector2D(-3,-3)));
  GLVertex3D((py+TVector2D(-3,-3)),(py+TVector2D(-2,3)));

  GLVertex3D((qy+TVector2D(3,2)),(qy+TVector2D(2,3)));      //S
  GLVertex3D((qy+TVector2D(2,3)),(qy+TVector2D(-2,3)));
  GLVertex3D((qy+TVector2D(-3,2)),(qy+TVector2D(3,-2)));
  GLVertex3D((qy+TVector2D(3,-2)),(qy+TVector2D(2,-3)));
  GLVertex3D((qy+TVector2D(2,-3)),(qy+TVector2D(-2,-3)));
  GLVertex3D((qy+TVector2D(-2,-3)),(qy+TVector2D(-3,-2)));
  GLVertex3D((qy+TVector2D(-3,-2)),(qy+TVector2D(-2,-3)));

  glColor3f(0.5,0.5,1);  
  GLVertex3D((pz+TVector2D(-3,3)),(pz+TVector2D(-3,-1.5))); //U
  GLVertex3D((pz+TVector2D(-3,-1.5)),(pz+TVector2D(-1.5,-3)));
  GLVertex3D((pz+TVector2D(-1.5,-3)),(pz+TVector2D(1.5,-3)));
  GLVertex3D((pz+TVector2D(1.5,-3)),(pz+TVector2D(3,-1.5)));
  GLVertex3D((pz+TVector2D(3,-1.5)),(pz+TVector2D(3,3)));
  GLVertex3D((pz+TVector2D(3,3)),(pz+TVector2D(3,-1.5)));

  GLVertex3D((qz+TVector2D(-3,3)),(qz+TVector2D(2,3)));     //D
  GLVertex3D((qz+TVector2D(2,3)),(qz+TVector2D(3,2))); 
  GLVertex3D((qz+TVector2D(3,2)),(qz+TVector2D(3,-2)));
  GLVertex3D((qz+TVector2D(3,-2)),(qz+TVector2D(2,-3)));
  GLVertex3D((qz+TVector2D(2,-3)),(qz+TVector2D(-3,-3)));
  GLVertex3D((qz+TVector2D(-3,-3)),(qz+TVector2D(-3,3)));

  glEnd();
}
//---------------------------------------------------------------------------

TGLWinRC::TGLWinRC()
  : FTrueTypeFonts("黑体"),FRC(0)
{
}

TGLWinRC::~TGLWinRC()
{
  DeleteRC();
}

HGLRC TGLWinRC::RC() const
{
  return FRC;
}

void TGLWinRC::CreateView2DRC(HDC dc)
{
  if (!FRC)
  {
    static const PIXELFORMATDESCRIPTOR pfd =
    {
      sizeof(PIXELFORMATDESCRIPTOR),1,PFD_DRAW_TO_WINDOW|PFD_SUPPORT_OPENGL|PFD_DOUBLEBUFFER,PFD_TYPE_RGBA,
      24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0
    };
    const int nPixelFormat = ChoosePixelFormat(dc,&pfd);
    SetPixelFormat(dc,nPixelFormat,&pfd);
    FRC = wglCreateContext(dc);
  }
}

void TGLWinRC::CreateBitmap2DRC(HDC dc)
{
  if (!FRC)
  {
    static const PIXELFORMATDESCRIPTOR pfd =
    {
      sizeof(PIXELFORMATDESCRIPTOR),1,PFD_DRAW_TO_BITMAP|PFD_SUPPORT_OPENGL|PFD_SUPPORT_GDI,PFD_TYPE_RGBA,
      24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0
    };
    const int nPixelFormat = ChoosePixelFormat(dc,&pfd);
    SetPixelFormat(dc,nPixelFormat,&pfd);
    FRC = wglCreateContext(dc);
  }
}
void TGLWinRC::CreateMetafile2DRC(HDC dc)
{
  if (!FRC)
  {
    static const PIXELFORMATDESCRIPTOR pfd =
    {
      sizeof(PIXELFORMATDESCRIPTOR),1,PFD_SUPPORT_OPENGL|PFD_SUPPORT_GDI,PFD_TYPE_RGBA,24,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0
    };
    const int nPixelFormat = ChoosePixelFormat(dc,&pfd);
    SetPixelFormat(dc,nPixelFormat,&pfd);
    FRC = wglCreateContext(dc);
  }
}
void TGLWinRC::CreateView3DRC(HDC dc)
{
  if (!FRC)
  {
    static const PIXELFORMATDESCRIPTOR pfd =
    {
      sizeof(PIXELFORMATDESCRIPTOR),1,PFD_DRAW_TO_WINDOW|PFD_SUPPORT_OPENGL|PFD_DOUBLEBUFFER,
      PFD_TYPE_RGBA,24,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0
    };
    const int pixel_format = ChoosePixelFormat(dc,&pfd);
    SetPixelFormat(dc,pixel_format,&pfd);
    FRC = wglCreateContext(dc);
  }
}
void TGLWinRC::CreateBitmap3DRC(HDC dc)
{
  if (!FRC)
  {
    static const PIXELFORMATDESCRIPTOR pfd =
    {
      sizeof(PIXELFORMATDESCRIPTOR),1,PFD_DRAW_TO_BITMAP|PFD_SUPPORT_OPENGL|PFD_SUPPORT_GDI,
      PFD_TYPE_RGBA,24,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0
    };
    const int nPixelFormat = ChoosePixelFormat(dc,&pfd);
    SetPixelFormat(dc,nPixelFormat,&pfd);
    FRC = wglCreateContext(dc);
  }
}
void TGLWinRC::CreateMetafile3DRC(HDC dc)
{
  if (!FRC)
  {
    static const PIXELFORMATDESCRIPTOR pfd =
    {
      sizeof(PIXELFORMATDESCRIPTOR),1,PFD_SUPPORT_OPENGL|PFD_SUPPORT_GDI,PFD_TYPE_RGBA,
      24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0
    };
    const int nPixelFormat = ChoosePixelFormat(dc,&pfd);
    SetPixelFormat(dc,nPixelFormat,&pfd);               
    FRC = wglCreateContext(dc);
  }
}

void TGLWinRC::DeleteRC()
{
  wglMakeCurrent(0,0);
  if (FRC)
  {
    wglDeleteContext(FRC);
    FRC = 0;
  }
}

//---------------------------------------------------------------------------

TGLWinRC::TGLViewLists::~TGLViewLists()
{
  for (iterator p=begin(); p!=end(); ++p)
  {
    if (glIsList(p->Data.Base))
      glDeleteLists(p->Data.Base,1);
  }
}

//---------------------------------------------------------------------------

TGLWinRC::TGLFontTrueType::TGLFontTrueType(const char *fontname)
  : Name(fontname),FCharSet(0),FWeight(0),FItalic(0)
{
}
TGLWinRC::TGLFontTrueType::TGLFontTrueType(const char *fontname, int weight, unsigned int italic)
  : Name(fontname),FCharSet(0),FWeight(weight),FItalic(italic)
{
}

TGLWinRC::TGLFontTrueType::~TGLFontTrueType()
{
  for (iterator p=begin(); p!=end(); ++p)
  {
    if (glIsList(p->Data.Base))
      glDeleteLists(p->Data.Base,1);
  }
}

void TGLWinRC::TGLFontTrueType::DrawString(HDC dc,const char *text) const
{
  GLint frontface;
  glGetIntegerv(GL_FRONT_FACE,&frontface);
  for (const unsigned char *p=(unsigned char *)text; *p; ++p)
  {
    if (*p < 128)
      glCallList(GetChar(dc,*p)->Data.Base);
    else if (p[1] >= 128)
    {
      glCallList(GetChar(dc,(unsigned short)(p[0]*256+p[1]))->Data.Base);
      ++p;
    }
    else
      glCallList(GetChar(dc,*p)->Data.Base);
  }
  glFrontFace(frontface);
}

TGLWinRC::TGLFontTrueType::const_iterator TGLWinRC::TGLFontTrueType::GetChar(HDC dc,unsigned short chr) const
{
  const_iterator p = Find(chr);
  if (p == end())
  {
    TGLFontTrueType &font = const_cast<TGLFontTrueType&>(*this); 
    const TGLViewList list = {font.GenChar(dc,chr),0};
    font.Insert(chr,list);
    p = Find(chr);
  }
  return p;
}

GLuint TGLWinRC::TGLFontTrueType::GenChar(HDC dc,unsigned short chr)
{
  LOGFONT lf;
  GLuint gfchr;
  ZeroMemory(&lf,sizeof(LOGFONT));
  lf.lfCharSet = DEFAULT_CHARSET;
  StrCopy(lf.lfFaceName,Name.c_str());
  HFONT font = CreateFontIndirect(&lf);
  font = (HFONT)SelectObject(dc,font);
  gfchr = glGenLists(1);
  wglUseFontOutlines(dc,chr,1,gfchr,0,0.5f,WGL_FONT_POLYGONS,0);
  font = (HFONT)SelectObject(dc,font);
  DeleteObject(font);
  return gfchr;
}
//---------------------------------------------------------------------------

TGLWinRC::TGLFontsTrueType::TGLFontsTrueType(const char *fontname)
{
  Insert(fontname,TGLFontTrueType(fontname));
}

TGLWinRC::TGLFontsTrueType::~TGLFontsTrueType()
{
  for (iterator p=begin(); p!=end(); ++p)
  {
    TGLFontTrueType &glf = p->Data;
    for (TGLFontTrueType::iterator q=glf.begin(); q!=glf.end(); ++q)
    {
      if (glIsList(q->Data.Base))
        glDeleteLists(q->Data.Base,1);
    }
  }
}

void TGLWinRC::TGLFontsTrueType::DrawString(HDC dc,const char *text,const char *fontname)
{
  const_iterator p = Find(fontname);
  if (p == end())
  {
    Insert(fontname,TGLFontTrueType(fontname));
    p = Find(fontname);
  }
  p->Data.DrawString(dc,text);
}

//---------------------------------------------------------------------------

TGLBase::TGLBitmap::TGLBitmap(int width,int height)
  : HDPM(0),VDPM(0),FData(0),FWidth32(0)
{
  DC = CreateCompatibleDC(0);
  Create(width,height);
}

TGLBase::TGLBitmap::TGLBitmap(int width,int height,int dpm)
  : HDPM(dpm),VDPM(dpm),FData(0)
{
  DC = CreateCompatibleDC(0);
  Create(width,height);
}

TGLBase::TGLBitmap::TGLBitmap(int width,int height,int hdpm,int vdpm)
  : HDPM(hdpm),VDPM(vdpm),FData(0)
{
  DC = CreateCompatibleDC(0);
  Create(width,height);
}

TGLBase::TGLBitmap::~TGLBitmap()
{
  Delete();
  if (DC)
    DeleteDC(DC);
}

void TGLBase::TGLBitmap::Create(int width,int height)
{
  if (DC)
  {
    FWidth32 = ((width+31)/32)*32;
    BITMAPINFOHEADER bmi = { sizeof(BITMAPINFOHEADER),FWidth32,height,1,24,BI_RGB,0,HDPM,VDPM,0,0 };
    Bitmap = CreateDIBSection(0,(BITMAPINFO*)&bmi,DIB_RGB_COLORS,&FData,0,0);
    if (Bitmap)
    {
      Bitmap = (HBITMAP)SelectObject(DC,Bitmap);
      Width = width;
      Height = height;
    }
  }
}

void TGLBase::TGLBitmap::Delete()
{
  if (DC)
  {
    Bitmap = (HBITMAP)SelectObject(DC,Bitmap);
    DeleteObject(Bitmap);
    Bitmap = 0;
    Width = Height = 0;
  }
}

void TGLBase::TGLBitmap::Resize(int width,int height)
{
  if (Width!=width || Height!=height)
  {
    Delete();
    Create(width,height);
  }
}

//-------------------------------------------------------------------------

TGLBase::TGLPrinter::TGLPrinter(const char *filename,int width,int height)
  : FDC(0),Width(width),Height(height),FileName(filename)
{
  FDI.cbSize = sizeof FDI;
#ifdef UNICODE
  FDI.lpszDocName = L"GL打印";
#else
  FDI.lpszDocName = "GL打印";
#endif
  FDI.lpszOutput = 0;
  Create(width,height);
}

TGLBase::TGLPrinter::~TGLPrinter()
{
  Delete();
}

void TGLBase::TGLPrinter::Resize(int width,int height)
{
  if (!FDC || width!=Width || height!=Height)
  {
    Delete();
    Width = width;
    Height = height;
    Create(Width,Height);
  }
}

void TGLBase::TGLPrinter::Create(int width,int height)
{
  RECT rect = { 0,0,width,height };
#ifdef UNICODE
  FDC = CreateEnhMetaFile(0,TWStr(FileName).c_str(),&rect,0);
#else
  FDC = CreateEnhMetaFile(0,FileName.c_str(),&rect,0);
#endif
}

void TGLBase::TGLPrinter::Delete()
{
  if (FDC)
  {
    DeleteEnhMetaFile(CloseEnhMetaFile(FDC));
    FDC = 0;
  }
}

void TGLBase::TGLPrinter::Begin() const
{
  if (FDC)
  {
    StartDoc(FDC,&FDI);
    StartPage(FDC);
  }
}

void TGLBase::TGLPrinter::End() const
{
  if (FDC)
  {
    EndPage(FDC);
    EndDoc(FDC);
  }
}

//-------------------------------------------------------------------------

TGLWinRC* TGLBase::RC() const
{
  return FRC;
}
void TGLBase::RC(TGLWinRC* rc)
{
  FRC = rc;
}
void TGLBase::UseGL(HDC dc) const
{
  wglMakeCurrent(dc,FRC->FRC);
}

HDC TGLBase::DC() const
{
  return DoDC();
}

void TGLBase::DrawGLString0(const char *text)
{
//  GLint frontface;
//  glGetIntegerv(GL_FRONT_FACE,&frontface);
  glPushAttrib(GL_LIST_BIT);
  glPixelStorei(GL_UNPACK_ALIGNMENT,4);
  for (const unsigned char *p=(unsigned char *)text; *p; ++p)
  {
    if (*p < 128)
      DrawGLChar0(*p);
    else if (p[1] >= 128)
    {
      DrawGLChar0((unsigned short)(p[0]*256+p[1]));
      ++p;
    }
    else
      DrawGLChar0(*p);
  }
  glPopAttrib();
//  glFrontFace(frontface);
}

void TGLBase::DrawGLChar0(unsigned short chr)
{
  if (chr < 256)
  {
    if (chr<32 || chr>=127)
      chr = 32;
    chr -= (unsigned char)32;
    glBitmap(8,12,4,6,6,0,(const unsigned char *)FixedChar0[chr]);
  }
  else
  {
    unsigned int
      c1 = chr>>8,
      c2 = chr&0xFF;
    if (c1<=160 || c1>=247)
      c1 = c2 = 161;
    c1 -= 161;
    c2 -= 161;
    glBitmap(16,12,4,6,12,0,(const unsigned char*)FixedFont0[c1][c2]);
  }
}
void TGLBase::DrawGLString(const char *text, const char *font_name) const
{
  if (FRC)
    FRC->FTrueTypeFonts.DrawString(DC(),text,font_name);
}

//---------------------------------------------------------------------------

TGDI2DForView::TGDI2DForView(int,int)
  : TGL2DBase(),FDC(0)
{
  FRC = 0;
}

void TGDI2DForView::GLPainting(bool front, HDC dc) const
{
  FDC = dc;
}

HDC TGDI2DForView::DoDC() const
{
  return FDC;
}

/*
void TGDI2DForView::DoGLString0(const char *text) const
{
  DrawGLString0(text);
}

void TGDI2DForView::DoGLString(const char *text, const char *font_name) const
{
  DrawGLString(text,font_name);
}
*/
//----------------------------------------------------------------------------


