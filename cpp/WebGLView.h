WINBASES extern HCURSOR 
  Cursor_Isoline, Cursor_CutLine, Cursor_EditLine, Cursor_Line, Cursor_Select, Cursor_Delete, 
  Cursor_Point, Cursor_Polygon, Cursor_Polyline, Cursor_Text, Cursor_Ruler, Cursor_Light, 
  Cursor_MoveView, Cursor_ZoomIn, Cursor_ZoomOut, Cursor_ZoomRect, Cursor_ZoomView, Cursor_ZoomViewZ, Cursor_Rotate;  
//---------------------------------------------------------------------------

class TGLView;
//---------------------------------------------------------------------------

//���ͨ�ò�������
class WINBASES TGLViewOperation : public TFlag32
{
friend class TGLView;

protected:
  TGLView *FGLView;
  
public:
  int MouseState;   //���״̬:�û�����
  HCURSOR Cursor;   //���ָ��
  HMENU PopupMenu;  //�����˵�

public:
  bool
    Mode2D,         //��ά����ģʽ,��������ǰ,����
    Temporary,      //��ʱ������־
    Paint2NeedDown;

public:
  void MouseDown(HDC dc, WORD keys, const TPosition2D &position);         //��갴���¼�
  void MouseMove(HDC dc, WORD keys, const TPosition2D &position, bool downflag);  //����ƶ��¼�
  void MouseUp(HDC dc, WORD keys, const TPosition2D &position);          //���̧���¼�

  void MouseBegin();      //��������ʼ�¼�
  void MouseEnd();        //��������ֹ�¼�

  void MouseOK(int state);   //������ȷ���¼�
  void MouseCancel(int state);//������ȡ���¼�
  void MouseUndo(int state);  //�������ָ��¼�
  void MouseInsert(int state);//�����������¼�
  void MouseDelete(int state);//������ɾ���¼�
  void MouseCommand(int command, int state); //������ͨ�������¼�

  HMENU GetPopupMenu(HMENU popup_menu); //��̬�˵�

  bool MouseCapture(const TPosition2D &position, TPosition2D &nearest_position);//λ�ò�׽�¼�
  bool MouseCapture2D(const TGL2DBase &glbase, const TPosition2D &position, TPosition2D &nearest_position);//λ�ò�׽�¼�
  bool MouseCapture3D(const TGL3DBase &glbase, const TPosition2D &position, TPosition2D &nearest_position);//λ�ò�׽�¼�

  void Paint(HDC dc);  //��ͼ�����¼�
  void Paint2(HDC dc); //��ͼ�����¼�2

public:
  TGLViewOperation(TGLViewBase *glview);

protected:
  TGLViewBase* GLView() const;
  void Invalidate();

protected: 
  virtual void OnMouseDown(HDC dc, WORD keys, const TPosition2D &position);
  virtual void OnMouseMove(HDC dc, WORD keys, const TPosition2D &position, bool downflag);
  virtual void OnMouseUp(HDC dc, WORD keys, const TPosition2D &position);

  virtual void OnMouseBegin();
  virtual void OnMouseEnd();
  virtual void OnMouseOK(int state);
  virtual void OnMouseCancel(int state);
  virtual void OnMouseUndo(int state);
  virtual void OnMouseInsert(int state);
  virtual void OnMouseDelete(int state);
  virtual void OnMouseCommand(int command, int state);

  virtual HMENU OnGetPopupMenu(HMENU popup_menu);

  virtual bool OnMouseCapture(const TPosition2D &position, TPosition2D &nearest_position);
  virtual bool OnMouseCapture2D(const TGL2DBase &glbase, const TPosition2D &position, TPosition2D &nearest_position);
  virtual bool OnMouseCapture3D(const TGL3DBase &glbase, const TPosition2D &position, TPosition2D &nearest_position);
    
  virtual void OnPaint(HDC dc);
  virtual void OnPaint2(HDC dc);
};
//---------------------------------------------------------------------------
class WINBASES TGLView
{
  friend class TGLViewOperation;

public:
  enum TAutoViewType { avNone, avMove, avZoom, avRotate };

protected: // User declarations
  HDC FGLDC;
  HCURSOR FCursorOld;
  TPosition2D FCapturedPosition;
  TGLViewOperation *FMouseOperation,*FMouseOperation0;
  TPosition2D FTimeViewPosition1,FTimeViewPosition2;
  TAutoViewType FAutoView;

protected:
  bool
    FMouseLeftButtonDown,FMouseMiddleButtonDown,FMouseRightButtonDown,
    FDoubleClicked,FTemporaryFlag,FCapturedFlag,FEnableCapture,
    FSmoothRender,FNeedDeleteGL,FCanDraw,FValidFlag;
public:
  bool AllowCapture,AllowAutoView;

public:
  TPosition2D MouseDownPosition, MouseMovePosition;
  int MinMove;      //MouseMove�¼���С�ƶ���

public:
  TGLViewOperation* MouseOperation() const;
	void MouseOperation(TGLViewOperation *operation);
  bool PositionFixed() const;
  void PositionFixed(bool fixed);
  bool ScaleFixed() const;
  void ScaleFixed(bool fixed);
  bool DirectionFixed() const;
  void DirectionFixed(bool fixed);
  bool MovingLimit() const;
  void MovingLimit(bool limit);
  float MinZoom() const;
  void MinZoom(float min_zoom);
  float MaxZoom() const;
  void MaxZoom(float max_zoom);
  bool CanDraw() const;
  void CanDraw(bool can_draw);
  bool SmoothRender() const;
  void SmoothRender(bool smoothrender);

public:
  void Paint(HDC dc);
  void Paint2(HDC dc);
  void MousePosition(const TPosition2D &position);
  void ViewMoved();
  void ViewZoomed();
  void ViewRotated();

public:
  TGLView(var canvas);

public:
  const POINT ViewToScreen(const TPosition2D &point2d) const;
  const TPosition2D ScreenToView(const POINT &point) const;

  bool CanEndTemporaryOperation();
  void EndTemporaryOperation();
  void EndMouseOperation();

  void ZoomViewExtent(bool identify=false);
  void ZoomViewIn();
  void ZoomViewOut();

  void EnterGL();
  void LeaveGL();

  void MouseOK(int state);
  void MouseCancel(int state);
  void MouseUndo(int state);
  void MouseInsert(int state);
  void MouseDelete(int state);
  void MouseCommand(int command, int state);

  void MouseMoveLine(HDC dc);
  void MouseMoveRect(HDC dc);

  void MoveViewMouseMove(HDC dc, WORD keys, const TPosition2D &position, bool downflag);
  void ZoomInMouseUp(HDC dc, WORD keys, const TPosition2D &position);
  void ZoomOutMouseUp(HDC dc, WORD keys, const TPosition2D &position);
  void ZoomRectMouseUp(HDC dc, WORD keys, const TPosition2D &position);
  void ZoomViewMouseMove(HDC dc, WORD keys, const TPosition2D &position, bool downflag);
  void RotateViewMouseMove(HDC dc, WORD keys, const TPosition2D &position, bool downflag);

protected:
	void MouseOperation0(TGLViewOperation *operation);
  void EndTemporaryOperation0();
  void EndMouseOperation0();

  void SetAutoView(TAutoViewType auto_view,const TPosition2D &p2,const TPosition2D &p1);
  void ProcessMoveView(const TPosition2D &from,const TPosition2D &to,bool flag=false);

  void BeginTemporaryOperation();

  void ProcessZoomView(const TPosition2D &from,const TPosition2D &to,bool flag=false);

  const TPosition2D GenCapturePosition(HDC dc, WORD keys, int x, int y);
  void DrawCapturedPoint(HDC dc);

  bool ProcessMouseDown0(HDC dc, TMouseButton button, WORD keys, const TPosition2D &position);
  bool ProcessMouseMove0(HDC dc, WORD keys, const TPosition2D &position);
  bool ProcessMouseUp0(HDC dc, TMouseButton button, WORD keys, const TPosition2D &position);

  void ProcessMouseDown(HDC dc, TMouseButton button, WORD keys, const TPosition2D &position);
  void ProcessMouseMove(HDC dc, WORD keys, const TPosition2D &position);
  void ProcessMouseUp(HDC dc, TMouseButton button, WORD keys, const TPosition2D &position);
  void ZoomView(double scale);
  void MoveView(const TPosition2D &from, const TPosition2D &to);
  void ZoomView(const TPosition2D &position, double scale);
  void ZoomViewRect(TInterval2D &rect);
  void InitializeView();

protected:
  void WMMouseDown(TMouseButton button, WORD keys, int x, int y);
  void WMMouseMove(WORD keys, int x, int y);
  void WMMouseUp(TMouseButton button, WORD keys, int x, int y);
  void WMMouseWheel(WORD keys, int wheel_delta, int x, int y);
  void WMDblClick(WORD keys);
  void WMKeyDown(WORD key, WORD nkeys);
  void WMKeyUp(WORD key, WORD nkeys);

protected:
  virtual void AfterGLPaint(HDC dc); //��ͼ�����¼�
  virtual void OnPaint(HDC dc);
  virtual void OnPaint2(HDC dc);
  virtual void OnMousePosition(const TPosition2D &position);
  virtual void OnKey(WORD key, WORD keys, int state/*<0����,>0̧��*/);
  virtual void OnViewMoved();
  virtual void OnViewZoomed();
  virtual void OnViewRotated();
  virtual void OnInitializeView();
  virtual LRESULT OnMessage(UINT msg, WPARAM wparam, LPARAM lparam);

public:
  bool PositionXFixed() const;
  void PositionXFixed(bool fixed);
  bool PositionYFixed() const;
  void PositionYFixed(bool fixed);
  bool PositionXYFixed1() const;
  void PositionXYFixed1(bool fixed);
  bool IdentityXY() const;
  void IdentityXY(bool identityxy);

protected: // User declarations
  TGL2DBase *FGLBase;

protected:
  bool FNeedDraw,FIdentityXY,FViewChanged;

public:
  TPosition2D
    MouseDownMapPosition, MouseMoveMapPosition,
    MouseDownModelPosition, MouseMoveModelPosition;

public:
  bool NeedDraw() const;
  void NeedDraw(bool needdraw); 
  const TBound2D ModelBound() const;
  void ModelBound(const TBound2D &bds);
  const TVector2D ViewScale() const;
  void ViewScale(const TVector2D &view_scale);
  const TVector2D MapScale() const;
  void MapScale(const TVector2D &mapscale);
  const TPosition2D BasePosition() const;

public:
  TGLBase* GLBase();
  void GLPaint(TGLBase *glbase);
  void RedrawView(bool redraw_all);
  void DrawViewDirectly();

public: 
  const TPosition2D ModelToLocal(const TPosition2D &position) const;
  const TPosition2D LocalToModel(const TPosition2D &localposition) const;
  const TPosition2D ModelToMap(const TPosition2D &position) const;
  const TPosition2D MapToModel(const TPosition2D &mapposition) const;
  const TPosition2D MapToView(const TPosition2D &mapposition) const;
  const TPosition2D ViewToMap(const TPosition2D &viewposition) const;
  const TPosition2D ViewToModel(const TPosition2D &viewposition) const;
  const TPosition2D ModelToView(const TPosition2D &position) const;

private:  
  const POINT Point2DToPoint(const TPosition2D &point2d) const;
  const TPosition2D PointToPoint2D(const POINT &point) const;

protected:
  void DoAssign(HWND handle);

protected:
  void CreateGL();
  void DeleteGL();
  void GLBase(TGL2DBase *glbase);
  void ViewChanged(bool changed);

private:
  virtual LRESULT OnMessage(UINT msg, WPARAM wparam, LPARAM lparam);
  virtual void OnGLPaint(TGL2DBase *glbase);
  virtual void OnRedrawView(bool redraw_all);
  virtual void OnInitializeView();

private:
  void DrawView(HDC dc);
  void DrawViewOnPaint();
};

