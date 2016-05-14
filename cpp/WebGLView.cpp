#include "WebGLView.h"
//---------------------------------------------------------------------------
namespace LJF
{
  HCURSOR
    Cursor_Isoline = 0,
    Cursor_CutLine = 0,
    Cursor_EditLine = 0,
    Cursor_Line = 0,
    Cursor_Select = 0,
    Cursor_Delete = 0,
    Cursor_Point = 0,
    Cursor_Polygon = 0,
    Cursor_Polyline = 0,
    Cursor_Text = 0,
    Cursor_Ruler = 0,
    Cursor_Light = 0,
    Cursor_MoveView = 0,
    Cursor_ZoomIn = 0,
    Cursor_ZoomOut = 0,
    Cursor_ZoomRect = 0,
    Cursor_ZoomView = 0,
    Cursor_ZoomViewZ = 0,
    Cursor_Rotate = 0;
}
using namespace LJF;
//---------------------------------------------------------------------------
TGLViewOperation::TGLViewOperation(TGLViewBase *glview)
  : FGLView(glview),FGLView3Ds(0),MouseState(0),Cursor(0),PopupMenu(0)
{
  //Temporary(false);
  //Paint2NeedDown(false);
  //Mode2D(false);
}

TGLViewBase* TGLViewOperation::GLView() const
{
  return FGLView?FGLView:FGLView3Ds?FGLView3Ds->FCurrentView:0;
}
TGLView2DBase* TGLViewOperation::GLView2D() const
{
  return FGLView?dynamic_cast<TGLView2DBase*>(FGLView):0;
}
void TGLViewOperation::Invalidate()
{
  if (FGLView3Ds)  
    FGLView3Ds->Invalidate();
  else if (FGLView)
    FGLView->Invalidate();
}
void TGLViewOperation::MouseDown(HDC dc,WORD keys,const TPosition2D &position)
{
  TRY_BEGIN OnMouseDown(dc,keys,position); TRY_END0
}
void TGLViewOperation::MouseMove(HDC dc,WORD keys,const TPosition2D &position,bool downflag)
{
  TRY_BEGIN OnMouseMove(dc,keys,position,downflag); TRY_END0
}
void TGLViewOperation::MouseUp(HDC dc,WORD keys,const TPosition2D &position)
{
  TRY_BEGIN OnMouseUp(dc,keys,position); TRY_END0
}
void TGLViewOperation::MouseBegin()
{
  TRY_BEGIN OnMouseBegin(); TRY_END0
}
void TGLViewOperation::MouseEnd()
{
  TRY_BEGIN OnMouseEnd(); TRY_END0
}
void TGLViewOperation::MouseOK(int state)
{
  TRY_BEGIN OnMouseOK(state); TRY_END0 
}
void TGLViewOperation::MouseCancel(int state)
{
  TRY_BEGIN OnMouseCancel(state); TRY_END0
}
void TGLViewOperation::MouseUndo(int state)
{
  TRY_BEGIN OnMouseUndo(state); TRY_END0
}
void TGLViewOperation::MouseInsert(int state)
{
  TRY_BEGIN OnMouseInsert(state); TRY_END0
}
void TGLViewOperation::MouseDelete(int state)
{
  TRY_BEGIN OnMouseDelete(state); TRY_END0
}
void TGLViewOperation::MouseCommand(int command,int state)
{
  TRY_BEGIN OnMouseCommand(command,state); TRY_END0
}
bool TGLViewOperation::MouseCapture(const TPosition2D &position,TPosition2D &nearest_position)
{
  TRY_BEGIN return OnMouseCapture(position,nearest_position); TRY_END(false)
}
bool TGLViewOperation::MouseCapture2D(const TGL2DBase &glbase,const TPosition2D &position,TPosition2D &nearest_position)
{
  TRY_BEGIN return OnMouseCapture2D(glbase,position,nearest_position); TRY_END(false)
}
bool TGLViewOperation::MouseCapture3D(const TGL3DBase &glbase,const TPosition2D &position,TPosition2D &nearest_position)
{
  TRY_BEGIN return OnMouseCapture3D(glbase,position,nearest_position); TRY_END(false)
}
HMENU TGLViewOperation::GetPopupMenu(HMENU popup_menu)
{
  TRY_BEGIN return OnGetPopupMenu(popup_menu); TRY_END((HMENU)0)
}
void TGLViewOperation::Paint(HDC dc)
{
  TRY_BEGIN OnPaint(dc); TRY_END0
}
void TGLViewOperation::Paint2(HDC dc)
{
  TRY_BEGIN OnPaint2(dc); TRY_END0
}
void TGLViewOperation::OnMouseDown(HDC,WORD,const TPosition2D&)
{
}
void TGLViewOperation::OnMouseMove(HDC,WORD,const TPosition2D &,bool)
{
}
void TGLViewOperation::OnMouseUp(HDC,WORD,const TPosition2D &)
{
}
void TGLViewOperation::OnMouseBegin()
{
}
void TGLViewOperation::OnMouseEnd()
{
}
void TGLViewOperation::OnMouseOK(int)
{
}
void TGLViewOperation::OnMouseCancel(int)
{
}
void TGLViewOperation::OnMouseUndo(int)
{
}
void TGLViewOperation::OnMouseInsert(int)
{
}
void TGLViewOperation::OnMouseDelete(int)
{
}
void TGLViewOperation::OnMouseCommand(int,int)
{
}
bool TGLViewOperation::OnMouseCapture(const TPosition2D &,TPosition2D &)
{
  return false;
}
bool TGLViewOperation::OnMouseCapture2D(const TGL2DBase &,const TPosition2D &,TPosition2D &)
{
  return false;
}
bool TGLViewOperation::OnMouseCapture3D(const TGL3DBase &,const TPosition2D &,TPosition2D &)
{
  return false;
}
HMENU TGLViewOperation::OnGetPopupMenu(HMENU popup_menu)
{
  return popup_menu;
}
void TGLViewOperation::OnPaint(HDC)
{
}
void TGLViewOperation::OnPaint2(HDC)
{
}
//---------------------------------------------------------------------------
TGLViewBase::TGLViewBase()
  : FGLView3Ds(0),FAutoView(avNone),FMouseOperation(0),FMouseOperation0(0),FGLDC(0),MinMove(1)
{
  FNeedEraseBkgnd(false);
  //FMouseLeftButtonDown(false);
  //FMouseMiddleButtonDown(false);
  //FMouseRightButtonDown(false);
  //FTemporaryFlag(false);
  //FCapturedFlag(false);
  //AllowCapture(false);
  //FSmoothRender(false);
  //FValidFlag(false);
  //FDoubleClicked(false);
  FEnableCapture(true);
  FCanDraw(true);
  //AllowCapture(false);
  AllowAutoView(true);
}
TGLViewBase::~TGLViewBase()
{
}
void TGLViewBase::SetAutoView(TAutoViewType auto_view,const TPosition2D &p2,const TPosition2D &p1)
{
  FAutoView = auto_view;
  FTimeViewPosition1 = p1;
  FTimeViewPosition2 = p2;
}
LRESULT TGLViewBase::OnMessage(UINT msg,WPARAM wparam,LPARAM lparam)
{
  switch (msg)
  {
  case WM_MOUSEMOVE:
    WMMouseMove(GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_MOUSEWHEEL:
    WMMouseWheel(GenMouseKeys(LOWORD(wparam)),(short)HIWORD(wparam),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_LBUTTONDOWN:
    WMMouseDown(mbLeft,GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_LBUTTONUP:
    WMMouseUp(mbLeft,GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_MBUTTONDOWN:
    WMMouseDown(mbMiddle,GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_MBUTTONUP:
    WMMouseUp(mbMiddle,GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_RBUTTONDOWN:
    WMMouseDown(mbRight,GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_RBUTTONUP:
    WMMouseUp(mbRight,GenMouseKeys(LOWORD(wparam)),(short)LOWORD(lparam),(short)HIWORD(lparam));
    break;
  case WM_LBUTTONDBLCLK:
  case WM_MBUTTONDBLCLK:
  case WM_RBUTTONDBLCLK:
    WMDblClick(GenMouseKeys(LOWORD(wparam)));
    break;
  case WM_KEYDOWN: 
    WMKeyDown((int)wparam,LOWORD(lparam));
    break;
  case WM_KEYUP: 
    WMKeyUp((int)wparam,LOWORD(lparam));
    break;
  case WM_SIZE:
    Invalidate();
    break;
  }
  return TViewBase::OnMessage(msg,wparam,lparam);
}
const POINT TGLViewBase::ViewToScreen(const TPosition2D &point2d) const
{
  return FGLBase?FGLBase->ViewToScreen(point2d):Point2DToPoint(point2d);
}
const TPosition2D TGLViewBase::ScreenToView(const POINT &point) const
{
  return FGLBase?FGLBase->ScreenToView(point):PointToPoint2D(point);
}
const POINT TGLViewBase::Point2DToPoint(const TPosition2D &point2d) const
{
  RECT rect;
  GetClientRect(Handle,&rect);
  const POINT point = { (int)(point2d.X+(rect.right-rect.left)/2.0),(int)((rect.bottom-rect.top)/2.0-point2d.Y) };
  return point;
}
const TPosition2D TGLViewBase::PointToPoint2D(const POINT &point) const
{
  RECT rect;
  GetClientRect(Handle,&rect);
  return TPosition2D(point.x-(rect.right-rect.left)/2.0,(rect.bottom-rect.top)/2.0-point.y);
}
void TGLViewBase::Paint(HDC dc)
{
  TRY_BEGIN OnPaint(dc); TRY_END0
}
void TGLViewBase::Paint2(HDC dc)
{
  TRY_BEGIN OnPaint2(dc); TRY_END0
}
void TGLViewBase::MousePosition(const TPosition2D &position)
{
  TRY_BEGIN OnMousePosition(position); TRY_END0
}
void TGLViewBase::OnPaint(HDC)
{
}
void TGLViewBase::OnPaint2(HDC)
{
}
void TGLViewBase::OnMousePosition(const TPosition2D&)
{
}
void TGLViewBase::AfterGLPaint(HDC)
{
}
void TGLViewBase::ViewMoved()
{
  TRY_BEGIN OnViewMoved(); TRY_END0 
}
void TGLViewBase::ViewZoomed()
{
  TRY_BEGIN OnViewZoomed(); TRY_END0
}
void TGLViewBase::ViewRotated()
{
  TRY_BEGIN OnViewRotated(); TRY_END0
}
void TGLViewBase::OnViewMoved()
{
  Invalidate();
}
void TGLViewBase::OnViewZoomed()
{
  Invalidate();
}
void TGLViewBase::OnViewRotated()
{
  Invalidate();
}
void TGLViewBase::InitializeView()
{
  OnInitializeView();
}
void TGLViewBase::OnInitializeView()
{
}
TGLViewOperation* TGLViewBase::MouseOperation() const
{
  return FMouseOperation;
}

void TGLViewBase::MouseOperation0(TGLViewOperation *operation)
{
	if (operation != FMouseOperation)
	{
		if (operation)
		{
			if (operation->FGLView == this)
			{
				if (operation->Temporary())
				{
					EndTemporaryOperation();
					BeginTemporaryOperation();
					FMouseOperation = operation;
					SetCursor(FMouseOperation->Cursor);
				}
				else
				{
					FCapturedFlag(false);
					FMouseOperation = operation;
					SetCursor(FMouseOperation->Cursor);
				}
			}
		}
		else
		{
			FCapturedFlag(false);
			FMouseOperation = 0;
      SetCursor(Cursor0);
		}
	}
}
void TGLViewBase::MouseOperation(TGLViewOperation *operation)
{
	if (operation != FMouseOperation)
	{
		if (operation)
		{
			if (operation->FGLView == this)
			{
				if (operation->Temporary())
				{
					EndTemporaryOperation();
					BeginTemporaryOperation();
					FMouseOperation = operation;
          SetCursor(FMouseOperation->Cursor);
					FMouseOperation->MouseBegin();
				}
				else
				{
					FCapturedFlag(false);
					if (FMouseOperation)
						FMouseOperation->MouseEnd();
					FMouseOperation = operation;
          SetCursor(FMouseOperation->Cursor);
					FMouseOperation->MouseBegin();
				}
			}
		}
		else
		{
			FCapturedFlag(false);
			if (FMouseOperation)
				FMouseOperation->MouseEnd();
			FMouseOperation = 0;
      SetCursor(Cursor0);
		}
	}
}
bool TGLViewBase::ProcessMouseDown0(HDC dc,TMouseButton button,WORD keys,const TPosition2D &position)
{
  bool flag_left,flag_middle,flag_right,flag_shift,flag_ctrl,flag_alt;
  GetMouseKeys(keys,flag_left,flag_middle,flag_right,flag_shift,flag_ctrl,flag_alt);    
  if (!FMouseLeftButtonDown() && !FMouseMiddleButtonDown() && !FMouseRightButtonDown())
  {
    SetCapture(Handle);
    MouseDownPosition = position;
    MouseDownMapPosition = ViewToMap(MouseDownPosition);
    MouseDownModelPosition = MapToModel(MouseDownMapPosition);
    MouseMovePosition = MouseDownPosition;
    MouseMoveMapPosition = ViewToMap(MouseMovePosition);
    MouseMoveModelPosition = MapToModel(MouseMoveMapPosition);
    if (button == mbRight)
    {
      FCursorOld = GetCursor();
      FMouseRightButtonDown(true);
      FEnableCapture(false);
      if (!flag_left && !flag_middle)
      {
        const int flag = (flag_shift?1:0)+(flag_ctrl?2:0)+(flag_alt?4:0);
        if (flag == 0)
          SetCursor(Cursor_MoveView);
        else if (flag == 1)
          SetCursor(Cursor_ZoomView);
        else if (flag==2)
          SetCursor(Cursor_Rotate);
      }
      else if (flag_left)
        SetCursor(Cursor_ZoomView);
      else if (flag_middle)
        SetCursor(Cursor_MoveView);
      else
        SetCursor(Cursor_Rotate);
    }
    else if (button == mbMiddle)
    {
      FCursorOld = GetCursor();
      FMouseMiddleButtonDown(true);
      FEnableCapture(false);
      SetCursor(Cursor_Rotate);
    }
    else
    {
      if (flag_middle && flag_right)
        SetCursor(Cursor_Rotate);
      else if (flag_right)
        SetCursor(Cursor_ZoomView);
      else
        return true;
     }
  }
  return false;
}
void TGLViewBase::ProcessMouseDown(HDC dc,TMouseButton button,WORD keys,const TPosition2D &position)
{
  if (FMouseOperation)
    FMouseOperation->MouseDown(dc,keys,position);
  FMouseLeftButtonDown(true);
}
bool TGLViewBase::ProcessMouseMove0(HDC dc,WORD keys,const TPosition2D &position)
{
  bool flag_left,flag_middle,flag_right,flag_shift,flag_ctrl,flag_alt;
  GetMouseKeys(keys,flag_left,flag_middle,flag_right,flag_shift,flag_ctrl,flag_alt);    
  if (FMouseRightButtonDown())
  {
    if (!flag_left && !flag_middle)
    {
      const int flag = (flag_shift?1:0)+(flag_ctrl?2:0)+(flag_alt?4:0);
      if (flag == 0)
      {
        SetCursor(Cursor_MoveView);
        MoveViewMouseMove(dc,keys,position,true);
      }  
      else if (flag == 1)
      {
        SetCursor(Cursor_ZoomView);
        ZoomViewMouseMove(dc,keys,position,true);
      }  
      else if (flag==2)
      {
        SetCursor(Cursor_Rotate);
        RotateViewMouseMove(dc,keys,position,true);
      }        
    }
    else if (flag_left)
    {
      SetCursor(Cursor_ZoomView);
      ZoomViewMouseMove(dc,keys,position,true);
    }  
    else if (flag_middle)
    {
      SetCursor(Cursor_MoveView);
      MoveViewMouseMove(dc,keys,position,true);
    }  
    else
    {
      SetCursor(Cursor_Rotate);
      RotateViewMouseMove(dc,keys,position,true);
    }  
  }
  else if (FMouseMiddleButtonDown())
  {
    SetCursor(Cursor_Rotate);
    RotateViewMouseMove(dc,keys,position,true);
  }
  else if (FMouseLeftButtonDown())
  {
    if (flag_middle && flag_right)
    {
      SetCursor(Cursor_Rotate);
      RotateViewMouseMove(dc,keys,position,true);
    }  
    else if (flag_right)
    {
      SetCursor(Cursor_ZoomView);
      ZoomViewMouseMove(dc,keys,position,true);
    }  
    else
      return true;
  }
  else
    return true;
  MouseMovePosition = position;
  MouseMoveMapPosition = ViewToMap(MouseMovePosition);
  MouseMoveModelPosition = MapToModel(MouseMoveMapPosition);
  return false;
}
void TGLViewBase::ProcessMouseMove(HDC dc,WORD keys,const TPosition2D &position)
{
  if (FMouseOperation)
  {
    if (~(MouseMovePosition-position) >= MinMove)
      FMouseOperation->MouseMove(dc,keys,position,FMouseLeftButtonDown());
    else
      return;
  }
  MouseMovePosition = position;
  MouseMoveMapPosition = ViewToMap(MouseMovePosition);
  MouseMoveModelPosition = MapToModel(MouseMoveMapPosition);
}
bool TGLViewBase::ProcessMouseUp0(HDC,TMouseButton button,WORD,const TPosition2D &position)
{
  if ((FMouseLeftButtonDown()&&button==mbLeft ? 1 : 0)
    + (FMouseMiddleButtonDown()&&button==mbMiddle ? 1 : 0)
    + (FMouseRightButtonDown()&&button==mbRight ? 1 : 0) == 1)
  {
    if (FMouseMiddleButtonDown())
    {
      if (FMouseOperation && ~(position-MouseDownPosition)>=1)
        ViewRotated();
      SetCursor(FCursorOld);
      FMouseMiddleButtonDown(false);
      FEnableCapture(true);
    }
    else if (FMouseRightButtonDown())
    {
      if (~(position-MouseDownPosition) < 3)
      {
        if (HMENU popup_menu = FMouseOperation?FMouseOperation->GetPopupMenu(FMouseOperation->PopupMenu):PopupMenu)
        {
          POINT point = ViewToScreen(position);
          ClientToScreen(Handle,&point);
          TrackPopupMenu(popup_menu,TPM_LEFTALIGN,point.x,point.y,0,Handle,0);
        }
        FGLView3Ds?FGLView3Ds->EndTemporaryOperation():EndTemporaryOperation();
      }                    
      else
        ViewMoved();
      SetCursor(FCursorOld);
      FMouseRightButtonDown(false);
      FEnableCapture(true);
    }
    else
    {
      FMouseLeftButtonDown(false);
      return true;
    } 
    ReleaseCapture();
  }
  return false;
}
void TGLViewBase::ProcessMouseUp(HDC dc,TMouseButton,WORD keys,const TPosition2D &position)
{
  ReleaseCapture();
  FMouseLeftButtonDown(false);
  if (FMouseOperation)
    FMouseOperation->MouseUp(dc,keys,position);
  
}
void TGLViewBase::WMKeyDown(WORD key,WORD nkeys)
{
  TRY_BEGIN OnKey(key,nkeys,-1); TRY_END0
}
void TGLViewBase::WMKeyUp(WORD key,WORD nkeys)
{
  TRY_BEGIN OnKey(key,nkeys,+1); TRY_END0
}
void TGLViewBase::OnKey(WORD key,WORD keys,int state)
{
  if (state > 0)
  {
    switch (key)
    {
    case VK_RETURN:
      MouseOK(0);
      break;
    case VK_ESCAPE:
      MouseCancel(0);
      break;
    case VK_BACK:
      MouseUndo(0);
      break;
    case VK_INSERT:
      MouseInsert(0);
      break;
    case VK_DELETE:
      MouseDelete(0);
      break;
    }
  }
}
void TGLViewBase::WMDblClick(WORD)
{
  FDoubleClicked(true);
}
void TGLViewBase::WMMouseWheel(WORD keys,int wheel_delta,int x,int y)
{
  if (FGLBase)
  {
    bool flag_left,flag_middle,flag_right,flag_shift,flag_ctrl,flag_alt;
    GetMouseKeys(keys,flag_left,flag_middle,flag_right,flag_shift,flag_ctrl,flag_alt);    
    const int op = (flag_shift?1:0) + (flag_alt?-1:0);
    const double wheel = Exp(wheel_delta*(op>0 ? 2.0 : op<0 ? 0.5 : 1.0)/600.0);
    bool flg = !FIdentityXY() && flag_shift;
    if (flag_ctrl)
    {
      TPosition2D position;//(ScreenToView(ScreenToClient(MousePos)));
      flg = flg ? FGLBase->Zoom(position,1,wheel) : FGLBase->Zoom(position,wheel);
    }
    else
      flg = flg ? FGLBase->Zoom(TPosition2D(),1,wheel) : FGLBase->Zoom(TPosition2D(),wheel);
    if (flg) 
    {
      ViewChanged(true); 
      Invalidate();
    }
  }
}
void TGLViewBase::WMMouseDown(TMouseButton button,WORD keys,int X,int Y)
{
  SetAutoView(avNone,MouseMovePosition,MouseMovePosition);
  if (!FDoubleClicked())
  {
    const POINT point = { X,Y };
    HDC dc = GetDC(Handle);
    if (ProcessMouseDown0(dc,button,keys,ScreenToView(point)))
    {
      ProcessMouseDown(dc,button,keys,GenCapturePosition(dc,keys,X,Y));
      if (FMouseOperation && FMouseLeftButtonDown() && FMouseOperation->Paint2NeedDown())
        FMouseOperation->Paint2(dc);
    }
    ReleaseDC(Handle,dc);
  }
  else
  {
    FDoubleClicked(false);
    return;
  }
}
void TGLViewBase::WMMouseMove(WORD keys,int X,int Y)
{
  const POINT point = { X,Y };
  TPosition2D position(ScreenToView(point));
  HDC dc = GetDC(Handle);
  if (ProcessMouseMove0(dc,keys,position))
  {
    if (FMouseOperation && (!FMouseOperation->Paint2NeedDown() || FMouseLeftButtonDown()))
      FMouseOperation->Paint2(dc);
    Paint2(dc);
    ProcessMouseMove(dc,keys,position=GenCapturePosition(dc,keys,X,Y));
    Paint2(dc);
    if (FMouseOperation && (!FMouseOperation->Paint2NeedDown() || FMouseLeftButtonDown()))
      FMouseOperation->Paint2(dc);
  }
  MousePosition(position);
  ReleaseDC(Handle,dc);
}
void TGLViewBase::WMMouseUp(TMouseButton button,WORD keys,int X,int Y)
{
  const POINT point = { X,Y };
  HDC dc = GetDC(Handle);
  if (ProcessMouseUp0(dc,button,keys,ScreenToView(point)))
  {
    if (FMouseOperation && FMouseLeftButtonDown() && FMouseOperation->Paint2NeedDown())
      FMouseOperation->Paint2(dc);
    ProcessMouseUp(dc,button,keys,GenCapturePosition(dc,keys,X,Y));
  }
  ReleaseDC(Handle,dc);
  FDoubleClicked(false);
}
void TGLViewBase::BeginTemporaryOperation()
{
  FCapturedFlag(false);
  if (!FTemporaryFlag())
  {
    FMouseOperation0 = FMouseOperation;
    FTemporaryFlag(true);
  }
  FMouseOperation = 0;
  SetCursor(0);
}
void TGLViewBase::EndTemporaryOperation()
{
  if (FTemporaryFlag())
  {
    if (FMouseOperation)
      FMouseOperation->MouseEnd();
    FMouseOperation = FMouseOperation0;
    SetCursor(FMouseOperation?FMouseOperation->Cursor:0);
    FTemporaryFlag(false);
    FMouseOperation0 = 0;

  }
}
void TGLViewBase::EndTemporaryOperation0()
{
  if (FTemporaryFlag())
  {
    FMouseOperation = FMouseOperation0;
    SetCursor(FMouseOperation ? FMouseOperation->Cursor : 0);
    FTemporaryFlag(false);
    FMouseOperation0 = 0;
  }
}
void TGLViewBase::MouseOK(int state)
{
  if (FMouseOperation)
    FMouseOperation->MouseOK(state);
}
void TGLViewBase::MouseCancel(int state)
{
  if (FMouseOperation)
    FMouseOperation->MouseCancel(state);
}
void TGLViewBase::MouseUndo(int state)
{
  if (FMouseOperation)
    FMouseOperation->MouseUndo(state);
}
void TGLViewBase::MouseInsert(int state)
{
  if (FMouseOperation)
    FMouseOperation->MouseInsert(state);
}
void TGLViewBase::MouseDelete(int state)
{
  if (FMouseOperation)
    FMouseOperation->MouseDelete(state);
}
void TGLViewBase::MouseCommand(int command,int state)
{
  if (FMouseOperation)
    FMouseOperation->MouseCommand(command,state);
}
void TGLViewBase::ZoomInMouseUp(HDC,WORD,const TPosition2D &position)
{
  if (FGLBase && FGLBase->ZoomIn(center))
  {
    ViewChanged(true);
    Invalidate();
  }
  ViewZoomed();
}
void TGLViewBase::ZoomOutMouseUp(HDC,WORD,const TPosition2D &position)
{
  if (FGLBase && FGLBase->ZoomOut(position))
  {
    ViewChanged(true);
    Invalidate();
  }
  ViewZoomed();
}
void TGLViewBase::MouseMoveRect(HDC dc)
{
  const POINT
    p1 = ViewToScreen(MouseDownPosition),
    p2 = ViewToScreen(MouseMovePosition);
  const int rop2 = SetROP2(dc,R2_NOT);
  MoveToEx(dc,p1.x,p1.y,0);
  LineTo(dc,p2.x,p1.y);
  LineTo(dc,p2.x,p2.y);
  LineTo(dc,p1.x,p2.y);
  LineTo(dc,p1.x,p1.y);
  SetROP2(dc,rop2);
}
void TGLViewBase::ZoomRectMouseUp(HDC,WORD,const TPosition2D &position)
{
  if (~(position-MouseDownPosition) >= 10)
    ZoomViewRect(TInterval2D(MouseDownPosition,position)); 
}
void TGLViewBase::ZoomViewMouseMove(HDC,WORD,const TPosition2D &position,bool downflag)
{
  if (downflag)
    ProcessZoomView(MouseMovePosition,position);
}
void TGLViewBase::ProcessZoomView(const TPosition2D &from,const TPosition2D &to,bool flag)
{
  const double d = to.Y-from.Y;
  if (d != 0)
    ZoomView(Exp(d/(flag?200:100)));
}
void TGLViewBase::MouseMoveLine(HDC dc)
{
  const POINT
    p1 = ViewToScreen(MouseDownPosition),
    p2 = ViewToScreen(MouseMovePosition);
  const int rep2 = SetROP2(dc,R2_NOT);
  MoveToEx(dc,p1.x,p1.y,0);
  LineTo(dc,p2.x,p2.y);
  SetROP2(dc,rep2);
}
void TGLViewBase::MoveViewMouseMove(HDC,WORD,const TPosition2D &position,bool downflag)
{
  if (downflag)
    ProcessMoveView(MouseMovePosition,position);
}
void TGLViewBase::ProcessMoveView(const TPosition2D &from,const TPosition2D &to,bool flag)
{
  if (from != to)
    MoveView(flag?(from+to)/2:from,to);
}
void TGLViewBase::RotateViewMouseMove(HDC dc,WORD keys,const TPosition2D &position,bool downflag)
{
  if (FGLBase && downflag)
  {
    const TVector2D
      v1 = FGLBase->ViewToMap(MouseMovePosition),
      v2 = FGLBase->ViewToMap(position);
    if (!IsZero(v1) && !IsZero(v2))
    {
      const double angle = RadToDeg(+(v2/v1));
      if (angle != 0)
      {
        if (FGLBase->Rotate(angle))
        {
          ViewRotated();
          ViewChanged(true);
          Invalidate();
        }
      }
    }
  }
}
const TPosition2D TGLViewBase::GenCapturePosition(HDC dc,WORD,int x,int y)
{
  if (FCapturedFlag())
    DrawCapturedPoint(dc);
  const POINT point = { x,y };
  TPosition2D mouse_position = ScreenToView(point);
  if (AllowCapture() && FEnableCapture() && FMouseOperation)
  {
    FCapturedFlag(false);
    TPosition2D captureed_position;
    if (FMouseOperation->MouseCapture2D(*FGLBase,mouse_position,captured_position)?true:FMouseOperation->MouseCapture(mouse_position,captured_position))
    {
      FCapturedPosition = mouse_position = captureed_position;
      FCapturedFlag(true);
    }
  }
  if (FCapturedFlag())
    DrawCapturedPoint(dc);
  return mouse_position; 
}
void TGLViewBase::DrawCapturedPoint(HDC dc)
{
  const POINT p = ViewToScreen(FCapturedPosition);
  const int rop2 = SetROP2(dc,R2_XORPEN);
  HPEN pen = (HPEN)SelectObject(dc,CreatePen(PS_SOLID,0,0x00FF0000));
  int d = 8;
    MoveToEx(dc,p.x-d,p.y-d,0);
    LineTo(dc,p.x+d,p.y-d);
    LineTo(dc,p.x+d,p.y+d);
    LineTo(dc,p.x-d,p.y+d);
    LineTo(dc,p.x-d,p.y-d);
  d = 6;
    MoveToEx(dc,p.x-d,p.y-d,0);
    LineTo(dc,p.x+d,p.y-d);
    LineTo(dc,p.x+d,p.y+d);
    LineTo(dc,p.x-d,p.y+d);
    LineTo(dc,p.x-d,p.y-d);
  d = 4;
    MoveToEx(dc,p.x-d,p.y-d,0);
    LineTo(dc,p.x+d,p.y-d);
    LineTo(dc,p.x+d,p.y+d);
    LineTo(dc,p.x-d,p.y+d);
    LineTo(dc,p.x-d,p.y-d);
  DeleteObject(SelectObject(dc,pen));
  pen = (HPEN)SelectObject(dc,CreatePen(PS_SOLID,0,0x0000FFFF));
  d = 7;
    MoveToEx(dc,p.x-d,p.y-d,0);
    LineTo(dc,p.x+d,p.y-d);
    LineTo(dc,p.x+d,p.y+d);
    LineTo(dc,p.x-d,p.y+d);
    LineTo(dc,p.x-d,p.y-d);
  d = 5;
    MoveToEx(dc,p.x-d,p.y-d,0);
    LineTo(dc,p.x+d,p.y-d);
    LineTo(dc,p.x+d,p.y+d);
    LineTo(dc,p.x-d,p.y+d);
    LineTo(dc,p.x-d,p.y-d);
  d = 3;
    MoveToEx(dc,p.x-d,p.y-d,0);
    LineTo(dc,p.x+d,p.y-d);
    LineTo(dc,p.x+d,p.y+d);
    LineTo(dc,p.x-d,p.y+d);
    LineTo(dc,p.x-d,p.y-d);
  SetROP2(dc,rop2);
  DeleteObject(SelectObject(dc,pen));
}
void TGLViewBase::ZoomViewIn()
{
  if (FGLBase && FGLBase->ZoomIn(TPosition2D()))
  {
    ViewChanged(true);
    Invalidate();
  }
}
void TGLViewBase::ZoomViewOut()
{
  if (FGLBase && FGLBase->ZoomOut(TPosition2D()))
  {
    ViewChanged(true);
    Invalidate();
  }
}
void TGLViewBase::EndMouseOperation()
{
	MouseOperation(0);
}
void TGLViewBase::EndMouseOperation0()
{
	MouseOperation0(0);
}
bool TGLViewBase::CanEndTemporaryOperation()
{
	return FTemporaryFlag(); 
}
void TGLViewBase::EnterGL()
{
}
void TGLViewBase::LeaveGL()
{
}
bool TGLViewBase::PositionFixed() const
{
  return FGLBase ? FGLBase->PositionFixed() : false;
}
void TGLViewBase::PositionFixed(bool fixed)
{
  if (FGLBase)
    FGLBase->PositionFixed(fixed);
}
bool TGLViewBase::ScaleFixed() const
{
  return FGLBase ? FGLBase->ScaleFixed() : false;
}
void TGLViewBase::ScaleFixed(bool fixed)
{
  if (FGLBase)
    FGLBase->ScaleFixed(fixed);
}
bool TGLViewBase::DirectionFixed() const
{
  return FGLBase ? FGLBase->DirectionFixed() : false;
}
void TGLViewBase::DirectionFixed(bool fixed)
{
  if (FGLBase)
    FGLBase->DirectionFixed(fixed); 
}
bool TGLViewBase::MovingLimit() const
{
  return FGLBase ? FGLBase->MovingLimit() : false;
}
void TGLViewBase::MovingLimit(bool limit)
{
  if (FGLBase)
    FGLBase->MovingLimit(limit); 
}
float TGLViewBase::MinZoom() const
{
  return FGLBase ? (float)FGLBase->MinZoom() : 1.0f;
}
void TGLViewBase::MinZoom(float min_zoom)
{
  if (FGLBase)
    FGLBase->MinZoom(min_zoom);
}
float TGLViewBase::MaxZoom() const
{
  return FGLBase ? (float)FGLBase->MaxZoom() : 1.0f;
}
void TGLViewBase::MaxZoom(float max_zoom)
{
  if (FGLBase)
    FGLBase->MaxZoom(max_zoom);
}
void TGLViewBase::MoveView(const TPosition2D &from,const TPosition2D &to)
{
  if (FGLBase && FGLBase->Move(from,to))
  {
    ViewChanged(true);
    Invalidate();
  }
  ViewMoved();
}
void TGLViewBase::ZoomView(double scale)
{
  if (FGLBase && FGLBase->Zoom(TPosition2D(),scale))
  {
    ViewChanged(true);
    Invalidate();
  }
  ViewZoomed();
}
void TGLViewBase::ZoomView(const TPosition2D &position,double scale)
{
  if (FGLBase && FGLBase->Zoom(position,scale))
  {
    ViewChanged(true);
    Invalidate();
  }
  ViewZoomed();
}
void TGLViewBase::ZoomViewRect(TInterval2D &rect)
{
  if (FGLBase && FGLBase->ZoomRect(rect,FIdentityXY()))
  {
    ViewChanged(true);
    Invalidate();
  }
  ViewZoomed();
}
void TGLViewBase::ZoomViewExtent(bool identify)
{
  if (FGLBase)
  {
    FGLBase->ZoomExtent(identify||FIdentityXY());
    ViewChanged(true);
    Invalidate();
  }
  ViewZoomed();
}
bool TGLViewBase::CanDraw() const
{
  return FCanDraw();
}
void TGLViewBase::CanDraw(bool can_draw)
{
  if (FCanDraw() != can_draw)
  {
    FCanDraw(can_draw);
    if (FCanDraw())
      Invalidate();
  } 
}
bool TGLViewBase::SmoothRender() const
{
  return FSmoothRender();
}
void TGLViewBase::SmoothRender(bool smoothrender)
{
  if (FSmoothRender() != smooth_render)
  {
    FSmoothRender(smooth_render); 
    NeedDraw(true);
    Invalidate();
  }
}
//---------------------------------------------------------------------------
TGLView2DBase::TGLView2DBase()
  : FGLBase(0)
{
  FNeedDraw(true);
  FIdentityXY(true);
  //FViewChanged(false);
}
TGLView2DBase::~TGLView2DBase()
{
  DeleteGL();
}
TGL2DBase* TGLView2DBase::GLBase()
{
  return FGLBase;
}
void TGLView2DBase::GLBase(TGL2DBase *glbase)
{
  if (FGLBase != glbase)
  {
    if ((FGLBase=glbase) != 0)
    {
      RECT rect;
      if (GetClientRect(Handle,&rect))
      {
        if (rect.right>rect.left && rect.bottom>rect.top)
          FGLBase->ViewRect(rect);
      } 
      NeedDraw(true);
      Invalidate();
    }
  }
}
bool TGLView2DBase::PositionXFixed() const
{
  return FGLBase ? FGLBase->PositionXFixed() : false;
}
void TGLView2DBase::PositionXFixed(bool fixed)
{
  if (FGLBase)
    FGLBase->PositionXFixed(fixed);
}
bool TGLView2DBase::PositionYFixed() const
{
  return FGLBase ? FGLBase->PositionYFixed() : false;
}
void TGLView2DBase::PositionYFixed(bool fixed)
{
  if (FGLBase)
    FGLBase->PositionYFixed(fixed);
}
bool TGLView2DBase::PositionXYFixed1() const
{
  return FGLBase ? FGLBase->PositionXYFixed1() : false;
}
void TGLView2DBase::PositionXYFixed1(bool fixed)
{
  if (FGLBase)
    FGLBase->PositionXYFixed1(fixed);
}
const TBound2D TGLView2DBase::ModelBound() const
{
  return FGLBase?FGLBase->ModelBound():TBound2D();
}
void TGLView2DBase::ModelBound(const TBound2D &bds)
{
  if (FGLBase)
  {
    FGLBase->ModelBound(bds); 
    NeedDraw(true); 
    Invalidate(); 
  }
}
void TGLView2DBase::CreateGL()
{
  RECT rect;
  GetClientRect(Handle,&rect);
  GLBase(new TGDI2DForView(rect.right-rect.left,rect.bottom-rect.top));
  HDC dc = GetDC(Handle);
  FGLBase->ViewResolutionDPI(TVector2D(GetDeviceCaps(dc,LOGPIXELSX),GetDeviceCaps(dc,LOGPIXELSY)));
  ReleaseDC(Handle,dc);
}
void TGLView2DBase::DeleteGL()
{
  if (FGLBase)
  {
    delete FGLBase;
    FGLBase = 0;
  }    
}
void TGLView2DBase::GLPaint(TGL2DBase *glbase)
{
  TRY_BEGIN OnGLPaint(glbase); TRY_END0
}
void TGLView2DBase::OnGLPaint(TGL2DBase*)
{
}
void TGLView2DBase::RedrawView(bool redraw_all)
{
  TRY_BEGIN OnRedrawView(redraw_all); TRY_END0
}
void TGLView2DBase::OnRedrawView(bool)
{
}
void TGLView2DBase::OnInitializeView()
{
}
void TGLView2DBase::DrawView(HDC dc)
{
  TRGBColor color;
  color.Color(Color);
  if (FGLBase)
  {
    FGLBase->GLPainting(false,dc);
    GLPaint(glview);
    FGLBase->GLPainting(false,0);
  }
  FNeedDraw(false);
  FViewChanged(false);
  const bool flag = FMouseOperation && (!FMouseOperation->Paint2NeedDown() || FMouseLeftButtonDown());
  if (FMouseOperation0 || flag || FCapturedFlag())
  {
    Paint(dc);
    Paint2(dc);
    if (FMouseOperation0)
      FMouseOperation0->Paint(dc);
    if (FMouseOperation)
      FMouseOperation->Paint(dc);
    if (flag)
      FMouseOperation->Paint2(dc);
    if (FCapturedFlag())
      DrawCapturedPoint(dc);
  }
}
void TGLView2DBase::DrawViewOnPaint()
{
  PAINTSTRUCT ps;
  HDC dc = BeginPaint(Handle,&ps);
  ::SetBkColor(dc,Color);
  DrawView(dc);
  EndPaint(Handle,&ps);
}
void TGLView2DBase::DrawViewDirectly()
{
  HDC dc = ::GetDC(Handle);
  DrawView(dc);
  ReleaseDC(Handle,dc);
}
LRESULT TGLView2DBase::OnMessage(UINT msg,WPARAM wparam,LPARAM lparam)
{
  switch (msg)
  {
  case WM_PAINT:
    if (FCanDraw())
    {
      FCapturedFlag(false);
      if (FGLBase)
        DrawViewOnPaint();
    }
    break;
  case WM_SIZE:
    if (FGLBase)
    {
      RECT rect;
      if (GetClientRect(Handle,&rect))
      {
        if (rect.right>rect.left && rect.bottom>rect.top)
        {
          FGLBase->ViewRect(rect);
          if (!FValidFlag())
          {
            FValidFlag(true);
            InitializeView();
          }
        }         
      } 
    }
    ViewChanged(true);
    NeedDraw(true);
    Invalidate();
    break;
  case WM_DISPLAYCHANGE:
    if (FGLBase)
      FGLBase->ViewResolutionDPI(TVector2D(GetDeviceCaps(FGLBase->DC(),LOGPIXELSX),GetDeviceCaps(FGLBase->DC(),LOGPIXELSY)));
    break;
  }
  return TGLViewBase::OnMessage(msg,wparam,lparam);
}
const TPosition2D TGLView2DBase::MapToView(const TPosition2D &mapposition) const
{
  return FGLBase->MapToView(mapposition);
}
const TPosition2D TGLView2DBase::ViewToMap(const TPosition2D &viewposition) const
{
  return FGLBase->ViewToMap(viewposition);
}
const TPosition2D TGLView2DBase::ModelToLocal(const TPosition2D &position) const
{
  return FGLBase->ModelToLocal(position);
}
const TPosition2D TGLView2DBase::LocalToModel(const TPosition2D &localposition) const
{
  return FGLBase->LocalToModel(localposition);
}
const TPosition2D TGLView2DBase::ModelToMap(const TPosition2D &position) const
{
  return FGLBase->ModelToMap(position);
}
const TPosition2D TGLView2DBase::MapToModel(const TPosition2D &mapposition) const
{
  return FGLBase->MapToModel(mapposition);
}
const TPosition2D TGLView2DBase::ViewToModel(const TPosition2D &viewposition) const
{
  return FGLBase->ViewToModel(viewposition);
}
const TPosition2D TGLView2DBase::ModelToView(const TPosition2D &position) const
{
  return FGLBase->ModelToView(position);
}
const TVector2D TGLView2DBase::ViewScale() const
{
  if (FGLBase)
    return FGLBase->ViewScale();
  return TVector2D(1,1);
}
void TGLView2DBase::ViewScale(const TVector2D &view_scale)
{
  if (FGLBase)
    FGLBase->ViewScale(view_scale); 
}
const TVector2D TGLView2DBase::MapScale() const
{
  if (FGLBase)
    return FGLBase->MapScale();
  return TVector2D(1,1);
}
void TGLView2DBase::MapScale(const TVector2D &mapscale)
{
  if (FGLBase)
  {
    FGLBase->MapScale(mapscale);
    NeedDraw(true);
    Invalidate();
  }
}
const TPosition2D TGLView2DBase::BasePosition() const
{
  if (FGLBase)
    return FGLBase->BasePosition();
  return TPosition2D();
}
bool TGLView2DBase::NeedDraw() const
{
  return FNeedDraw();
}
void TGLView2DBase::NeedDraw(bool need_draw)
{
  if (need_draw)
  {
    FNeedDraw(true);
    RedrawView(true);
  }
}
void TGLView2DBase::ViewChanged(bool changed)
{
  if (changed)
  {
    FViewChanged(true);
    RedrawView(false);
  } 
}
bool TGLView2DBase::IdentityXY() const
{
  return FIdentityXY();
}
void TGLView2DBase::IdentityXY(bool identityxy)
{
  if (FIdentityXY() != identityxy)
  {
    FIdentityXY(identityxy);
    if (FIdentityXY())
    {
      FGLBase->ViewScale(TVector2D(FGLBase->ViewScale().X,FGLBase->ViewScale().X));
      NeedDraw(true);
      Invalidate();
    }
  }
}
void TGLView2DBase::DoAssign(HWND handle)
{
  const HWND handle0 = Handle;
  if (handle0 != handle)
  {
    if (Handle)
      DeleteGL();
    TViewBase::DoAssign(handle);
    if (Handle)
    {
      CreateGL();
      InitializeView();
    }
  }
}
//---------------------------------------------------------------------------
TGLView2DGDI::TGLView2DGDI()
{
  FNeedEraseBkgnd(true);
}
//---------------------------------------------------------------------------


